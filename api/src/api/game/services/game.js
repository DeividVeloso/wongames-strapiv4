"use strict";

/**
 * game service
 */

const axios = require("axios");
const qs = require("querystring");
const slugify = require("slugify");

const { createCoreService } = require("@strapi/strapi").factories;

function Exception(e) {
  return {
    e,
    data: e.data && e.data.errors,
  };
}

async function getByName(name, entityName) {
  const entity = await strapi.db
    .query(`api::${entityName}.${entityName}`)
    .findOne({
      where: { name: name },
    });

  return entity ? entity : null;
}

async function create(name, entityName) {
  try {
    const item = await getByName(name, entityName);
    console.log("item=============>", item);

    if (!item) {
      return await strapi.service(`api::${entityName}.${entityName}`).create({
        data: {
          name,
          slug: slugify(name, { lower: true }),
        },
      });
    }
  } catch (error) {
    console.log(name, entityName);
    console.log("create", Exception(error));
  }
}

async function createManyToManyData(products) {
  const developers = {};
  const publishers = {};
  const categories = {};
  const platforms = {};

  products.forEach((product) => {
    const { developer, publisher, genres, supportedOperatingSystems } = product;

    genres &&
      genres.forEach((item) => {
        categories[item] = true;
      });

    supportedOperatingSystems &&
      supportedOperatingSystems.forEach((item) => {
        console.log(item);
        platforms[item] = true;
      });

    developers[developer] = true;
    publishers[publisher] = true;
  });

  return Promise.all([
    ...Object.keys(developers).map((name) => create(name, "developer")),
    ...Object.keys(publishers).map((name) => create(name, "publisher")),
    ...Object.keys(categories).map((name) => create(name, "category")),
    ...Object.keys(platforms).map((name) => create(name, "platform")),
  ]);
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setImage({ image, game, field = "cover" }) {
  try {
    const url = `https:${image}_bg_crop_1680x655.jpg`;
    const { data } = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data, "base64");

    const FormData = require("form-data");
    const formData = new FormData();

    formData.append("files", buffer, { filename: `${game.slug}.jpg` });
    formData.append("ref", "api::game.game");
    formData.append("refId", game.id);
    formData.append("field", field);

    await axios({
      method: "POST",
      url: `http://${strapi.config.host}:${strapi.config.port}/api/upload`,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
  } catch (error) {
    console.log("setImage", Exception(error));
  }
}

async function getGameInfo(slug) {
  try {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const body = await axios.get(`https://www.gog.com/en/game/${slug}`);
    const dom = new JSDOM(body.data);

    const ratingElement = dom.window.document.querySelector(
      "age-restrictions__icon use"
    );

    const description = dom.window.document.querySelector(".description");

    return {
      rating: ratingElement
        ? ratingElement
            .getAttribute("xlink:href")
            .replace(/_/g, "")
            .replace(/[^\w-]+/g, "")
        : "BR0",
      short_description: description.textContent.slice(0, 160),
      description: description.innerHTML,
    };
  } catch (error) {
    console.log("getGameInfo", Exception(error));
  }
}

async function createGames(products) {
  await Promise.all(
    products.map(async (product) => {
      const item = await getByName(product.title, "game");

      if (!item) {
        console.info(`Creating: ${product.title}...`);

        const game = await strapi.service("api::game.game").create({
          data: {
            name: product.title,
            slug: product.slug.replace(/_/g, "-"),
            price: product.price.amount,
            release_date: new Date(
              Number(product.globalReleaseDate) * 1000
            ).toISOString(),
            categories: await Promise.all(
              product.genres.map((name) => getByName(name, "category"))
            ),
            platforms: await Promise.all(
              product.supportedOperatingSystems.map((name) =>
                getByName(name, "platform")
              )
            ),
            developers: [await getByName(product.developer, "developer")],
            publisher: await getByName(product.publisher, "publisher"),
            ...(await getGameInfo(product.slug)),
          },
        });

        await setImage({ image: product.image, game });

        await Promise.all(
          product.gallery
            .slice(0, 5)
            .map((url) => setImage({ image: url, game, field: "gallery" }))
        );

        await timeout(2000);

        return game;
      }
    })
  );
}

// module.exports = createCoreService("api::game.game");
module.exports = createCoreService("api::game.game", ({ strapi }) => ({
  populate: async (params) => {
    try {
      //New URL
      //https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL
      // const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc&page=1&${qs.stringify(
      //   params
      // )}`;

      //Old URL
      //https://gogapidocs.readthedocs.io/en/latest/listing.html DOCS
      const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity&${qs.stringify(
        params
      )}`;

      const {
        data: { products },
      } = await axios.get(gogApiUrl);

      // console.log("products", products);
      await createManyToManyData(products);
      await createGames(products);
    } catch (error) {
      console.log("populate", error);
    }
  },
}));
