class PaymentController  {
  constructor(paymentService ) {
    this.paymentService  = paymentService; 
  }
  
  async getMercadoPagoLink(req, res) {
    const { name, price, unit, img } = req.body; 
    try {
    //recibe de createPaymentMercadoPago informacion del producto
    const checkout = await this.paymentService.createPaymentMercadoPago(
      name, // nombre del producto
      price, //precio del producto 
      unit,  //cantidad que estamos vendiendo
      img  // imagen de referencia del producto o servicio
    );
    
    //si es exitoso se lo lleva a la url de Mercado Pago
    return res.redirect(checkout.init_point);
    
    
    } catch (err) { 
    // si falla se devuelve un status 500
    return res.status(500).json({
      error: true,
      msg: "Hubo un error con Mercado Pago"
    });
    }
  }
  
  webhook(req, res) { 
    if (req.method === "POST") { 
      let body = ""; //body se va a sobreescribir a medida que el request se vaya resolviendo, ya que la info no llega entera, llega en chunks
      req.on("data", chunk => {  
      body += chunk.toString();
    });
      req.on("end", () => {  
      console.log(body, "webhook response"); 
      res.end("ok");
      });
    }
    return res.status(200); 
  }
}
  
module.exports = PaymentController;