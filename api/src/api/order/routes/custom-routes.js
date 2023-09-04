module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "POST",
      path: "/orders/create-payment-intent",
      handler: "order.createPaymentIntent",
    },
  ],
};
