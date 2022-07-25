import connection from "../dbStrategy/postgres.js";

export async function getGames(req, res) {
  const { name } = req.query;

  let games;

  try {
    if (!name) {
      const { rows } = await connection.query(`
      SELECT games.*, categories.name as "categoryName" FROM games
      JOIN categories
      ON games."categoryId" = categories.id
      ORDER BY games.id ASC`);

      games = rows;
    } else {
      const { rows } = await connection.query(
        `
      SELECT games.*, categories.name as "categoryName" FROM games
      JOIN categories
      ON games."categoryId" = categories.id 
      WHERE games.name ILIKE $1
      ORDER BY games.id ASC`,
        [`${name}%`]
      );

      games = rows;
    }

    res.send(games);
  } catch (err) {
    console.log("Error getting games", err.message);
    res.sendStatus(500);
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game;

  try {
    await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [
      name,
      image,
      stockTotal,
      categoryId,
      pricePerDay,
    ]);

    res.sendStatus(201);
  } catch (err) {
    console.log("Error creating a new game", err.message);
    res.sendStatus(500);
  }
}
