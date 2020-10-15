var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
 
var app = express();

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))

//se importa el controller y service de Payment y se permite que el controller use el service
const PaymentController = require("./controllers/PaymentController");
const PaymentService = require("./services/PaymentService"); 
const PaymentInstance = new PaymentController(new PaymentService()); 

 
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
