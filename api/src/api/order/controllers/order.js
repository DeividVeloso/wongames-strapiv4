"use strict";

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { sanitize } = require("@strapi/utils");
const { contentAPI } = sanitize;
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;
    console.log("cart", strapi.config.cart);
    // simplify cart data
    const cartGamesIds = await strapi.config.cart.cartGamesIds(cart);

    // get all games
    const games = await strapi.config.cart.cartItems(cartGamesIds);

    if (!games.length) {
      ctx.response.status = 404;
      return {
        error: "No valid games found!",
      };
    }

    const total = await strapi.config.cart.total(games);

    if (total === 0) {
      return {
        freeGames: true,
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
        metadata: { cart: JSON.stringify(cartGamesIds) },
      });

      return paymentIntent;
    } catch (err) {
      return {
        error: err.raw.message,
      };
    }
  },
  create: async (ctx) => {
    // pegar as informações do frontend
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body;

    // pega o token
    // const token = await strapi.plugins[
    //   "users-permissions"
    // ].services.jwt.getToken(ctx);
    const { user } = ctx.state;
    console.log("ctx.state", ctx.state.user);

    const userInfo = user;

    // simplify cart data
    const cartGamesIds = await strapi.config.cart.cartGamesIds(cart);

    // pegar os jogos
    const games = await strapi.config.cart.cartItems(cartGamesIds);

    // pegar o total (saber se é free ou não)
    const total_in_cents = await strapi.config.cart.total(games);

    // precisa pegar do frontend os valores do paymentMethod
    // e recuperar por aqui
    let paymentInfo;
    if (total_in_cents !== 0) {
      try {
        paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod);
      } catch (error) {
        ctx.response.status = 402;
        return { error: error.message };
      }
    }

    // salvar no banco
    const entry = {
      total_in_cents,
      payment_intent_id: paymentIntentId,
      card_brand: paymentInfo?.card?.brand,
      card_last4: paymentInfo?.card?.last4,
      user: userInfo.id,
      games,
    };

    console.log("entry", entry);

    const entity = await strapi
      .service("api::order.order")
      .create({ data: entry });

    try {
      // enviar um email da compra para o usuário
      //await strapi.plugin('email').service('email').send
      // await strapi.plugins["email-designer"].services.email.sendTemplatedEmail(
      await strapi
        .plugin("email-designer")
        .service("email")
        .sendTemplatedEmail(
          {
            to: userInfo.email,
            from: "no-reply@wongames.com",
          },
          {
            templateReferenceId: 1,
          },
          {
            user: userInfo,
            payment: {
              total: `$ ${total_in_cents / 100}`,
              card_brand: entry.card_brand,
              card_last4: entry.card_last4,
            },
            games,
          }
        );
      // await strapi.plugin('email').service('email').send({
      //   to: 'someone@example.com',
      //   from: 'someone2@example.com',
      //   subject: 'Hello world',
      //   text: 'Hello world',
      //   html: `<h4>Hello world</h4>`,
      // });
    } catch (error) {
      console.error(`sendTemplatedEmail`, error);
    }

    const contentType = strapi.contentType("api::order.order");
    // retornando que foi salvo no banco
    return await contentAPI.output(entity, contentType, ctx.state.auth);
  },
}));
