const axios = require("axios"); 

class PaymentService {
  constructor() {
    this.tokensMercadoPago = {
      prod: {},
      test: {
        access_token:
          "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398" 
      }
    }; 
    //declaro la url en el constructor para poder accederla en toda la class
    this.mercadoPagoUrl = "https://api.mercadopago.com/checkout"; 
  }

  // recibe las props que le mandamos desde el PaymentController
  async createPaymentMercadoPago(name, price, unit, img) {  
    
    //configuro la url aca asi queda accesible a toda la class
    const url = `${this.mercadoPagoUrl}/preferences?access_token=${this.tokensMercadoPago.test.access_token}`; 
    
        //preferencias de pago
        const preferences = {
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
          external_reference: "123456789", 
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
            success: "https://luanaselena-mp-commerce-nodejs.herokuapp.com/", 
            pending: "https://luanaselena-mp-commerce-nodejs.herokuapp.com/pending", 
            failure: "https://luanaselena-mp-commerce-nodejs.herokuapp.com/failure" 
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
    
        //se hace el post a la url que declaramos, con las preferencias y el header
        try {
          const request = await axios.post(url, preferences, {
            headers: { 
              "Content-Type": "application/json",
              "x-integrator-id": "dev_24c65fb163bf11ea96500242ac130004"
            }
          });
    
           //si el post es exitoso devolvemos la data y si falla se muestra el error
          return request.data; 
        } catch (e) {
          return console.log(e); 
        }
  }
}
    
module.exports = PaymentService;