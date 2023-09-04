const cartGamesIds = async (cart) =>
  await cart.map((game) => ({ id: game.id }));

const cartItems = async (cart) => {
  let games = [];

  await Promise.all(
    cart?.map(async (game) => {
      const existGame = await strapi.entityService.findOne(
        "api::game.game",
        game.id
      );

      if (existGame) {
        games.push(existGame);
      }
    })
  );

  return games;
};

const total = async (games) => {
  const amount = await games.reduce((acc, game) => {
    return acc + game.price;
  }, 0);

  return Number((amount * 100).toFixed(0));
};

module.exports = {
  cartGamesIds,
  cartItems,
  total,
};
