"use strict";

// {
//   populate: '*',
//   sort: 'title:asc',
//   filters: { title: { '$containsi': 'a' }, company: { '$eqi': 'luxora' } }
// }

/**
 * product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  // Method 3: Replacing a core action with proper sanitization
  async find(ctx) {
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    const { search, company, category, order, featured, shipping, price } =
      sanitizedQueryParams;

    const sortOptions = {
      high: "price:desc",
      low: "price:asc",
      "a-z": "title:asc",
      "z-a": "title:desc",
    };

    const queryObject = {
      populate: "*",
      sort: sortOptions["a-z"],
      filters: {},
    };
    if (order) {
      queryObject.sort = sortOptions[order];
    }

    if (search) {
      queryObject.filters.title = { $containsi: search };
    }
    if (company && company !== "all") {
      queryObject.filters.company = { $eqi: company };
    }
    if (category && category !== "all") {
      queryObject.filters.category = { $eqi: category };
    }
    if (featured) {
      queryObject.filters.featured = { $eq: true };
    }
    if (shipping) {
      queryObject.filters.shipping = { $eq: true };
    }
    if (price) {
      queryObject.filters.price = { $lte: price };
    }

    const { results, pagination } = await strapi
      .service("api::product.product")
      .find(queryObject);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, { pagination });
  },
}));
