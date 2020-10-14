var express = require('express');
var exphbs  = require('express-handlebars');
 
var app = express();

//se importa el controller y service de Compra y se permite que el controller use el service
const PaymentController = require("./controllers/PaymentController");
const PaymentService = require("./services/CompraService"); 
const PaymentInstance = new PaymentController(new PaymentService()); 
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.post("/payment/nuevo", (req, res) => 
  PaymentInstance.getMercadoPagoLink(req, res) 
);

app.post("/webhook", (req, res) => PaymentInstance.webhook(req, res));

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(process.env.PORT);

module.exports = app;
