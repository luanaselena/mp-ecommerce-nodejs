var express = require('express');
var exphbs  = require('express-handlebars');
 
var app = express();

//se importa el controller y service de Payment y se permite que el controller use el service
const PaymentController = require("./controllers/PaymentController");
const PaymentService = require("./services/PaymentService"); 
const PaymentInstance = new PaymentController(new PaymentService()); 





// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

// Agrega credenciales
mercadopago.configure({
  access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});

// Crea un objeto de preferencia
let preference = { 
  items: [
    {
      id: "1234", 
      title: name, //lo recibe en el controlador
      description: "Dispositivo movil de Tienda e-commerce",
      picture_url: img, //la recibe en el controlador
      category_id: "1234",  
      quantity: parseInt(unit), //lo recibe en el controlador
      currency_id: "ARS", //id de la moneda
      unit_price: parseFloat(price) //lo recibe en el controlador
    } //si se quisiera agregar otro item, se agrega otro en este array
  ],
  external_reference: "referencia del negocio", 
  payer: { 
    name: "Lalo",
    surname: "Landa",
    email: "test_user_63274575@testuser.com",
    phone: {
      area_code: "11",
      number: "22223333"
    },
    address: {
      zip_code: "1111",
      street_name: "Falsa",
      street_number: "123"
    }
  }, 
  // declaramos las urls de redireccionamiento
  back_urls: { 
    success: "https://luanaselena-mp-commerce-nodejs.herokuapp.com/success", 
    pending: "https://luanaselena-mp-commerce-nodejs.herokuapp.com/pending", 
    failure: "https://luanaselena-mp-commerce-nodejs.herokuapp.com/error" 
  }, 
  auto_return: "approved", //aca contempla que en caso de aprovado el retorno sea automatico
  payment_methods: { 
    //aca configuramos los metodos de pago que queremos excluir (American Express y atm)
    excluded_payment_methods: [ 
      {
        id: "amex"
      }
    ],
    excluded_payment_types: [
        { id: "atm" }
    ], 
    //se configura que el maximo de cuotas permitidas seran 6, y que aparezcan por defecto tambien 6. 
    installments: 6, 
    default_installments: 6 
  },
  notification_url: "https://luanaselena-mp-commerce-nodejs.herokuapp.com/webhook", 
  statement_descriptor: "TiendaEcommerce", 
};

mercadopago.preferences.create(preference)
  .then(function(response){
  // Este valor reemplazará el string "<%= global.id %>" en tu HTML
    global.id = response.body.id;
  }).catch(function(error){
    console.log(error);
});







 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get('/pending', function (req, res) {
  res.render('pending', req.query);
});

app.get('/failure', function (req, res) {
  res.render('failure', req.query);
});

app.post("/payment/new", (req, res) => 
  PaymentInstance.getMercadoPagoLink(req, res) 
)

app.post("/webhook", (req, res) => PaymentInstance.webhook(req, res));

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(process.env.PORT);

module.exports = app;
