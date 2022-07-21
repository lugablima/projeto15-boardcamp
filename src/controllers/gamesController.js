import connection from "../dbStrategy/postgres.js";

export async function getGames(req, res) {
  const { name } = req.query;

  let games;

  try {
    if (!name) {
      const { rows } = await connection.query("SELECT * FROM games");

      games = rows;
    } else {
      const nameQuery = `${name}%`;

      const { rows } = await connection.query("SELECT * FROM games WHERE name LIKE $1", [nameQuery]);
      // Falta fazer a pesquisa ser case insensitive

      games = rows;
    }

    // Falta colocar o categoryName;

    res.send(games);
  } catch (err) {
    console.log("Error while getting games", err.message);
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
    console.log("Error while creating a new game", err.message);
    res.sendStatus(500);
  }
}
