"use strict";
/**
 *  order controller
 */
const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You are not authorized!");
    }

    const { address, amount, products } = ctx.request.body.data;
    try {
      const order = await strapi.service("api::order.order").create({
        data: {
          address,
          amount,
          products,
          user: ctx.state.user.id,
        },
      });
      return order;
      // Charge the customer
      // Create the order
    } catch (err) {
      // return 500 error
      console.log("err", err);
      ctx.response.status = 500;
      return {
        error: { message: "There was a problem creating the charge" },
      };
    }
  },
}));
