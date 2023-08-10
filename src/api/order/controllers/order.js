"use strict";
/**
 *  order controller
 */
// {
//   populate: '*',
//   sort: 'title:asc',
//   filters: { title: { '$containsi': 'a' }, company: { '$eqi': 'luxora' } }
// }

const { createCoreController } = require("@strapi/strapi").factories;
const fakeData = require("./fakeData");

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You are not authorized!");
    }

    const queryObject = {
      populate: "*",
      sort: "createdAt:desc",
      filters: { user: user.id },
    };

    const { results, pagination } = await strapi
      .service("api::order.order")
      .find(queryObject);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, { pagination });
  },

  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You are not authorized!");
    }

    const { name, address, chargeTotal, orderTotal, products } =
      ctx.request.body.data;
    const requiredFields = {
      name,
      address,
      chargeTotal,
      orderTotal,
      products,
    };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return ctx.badRequest(`Please provide ${field} value`);
      }
    }

    if (isNaN(chargeTotal)) {
      return ctx.badRequest("charge total is not a number");
    }
    if (!Array.isArray(products) || products.length === 0) {
      return ctx.badRequest("Please add some products to your order");
    }

    if (user.username === "demo user" && user.email === "test@test.com") {
      const randomIndex = Math.floor(Math.random() * fakeData.length);
      const { name, address } = fakeData[randomIndex];

      ctx.request.body.data.name = name;
      ctx.request.body.data.address = address;
    }

    try {
      const order = await strapi.service("api::order.order").create({
        data: {
          ...ctx.request.body.data,
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
