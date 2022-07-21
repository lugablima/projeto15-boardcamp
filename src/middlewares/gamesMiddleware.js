import connection from "../dbStrategy/postgres.js";
import gameSchema from "../schemas/gamesSchema.js";

async function validateGame(req, res, next) {
  const game = req.body;

  const { error } = gameSchema.validate(game, { abortEarly: false });

  if (error) {
    return res.status(400).send(error.details.map((el) => ({ message: el.message })));
  }
  // Precisa fazer a busca pelo jogo ser case insensitive
  try {
    const { rows } = await connection.query("SELECT * FROM games WHERE name = $1", [game.name]);
    const gameAlreadyExist = rows[0];

    if (gameAlreadyExist) return res.status(409).send("Esse jogo já existe!");

    res.locals.game = game;

    next();
  } catch (err) {
    console.log("Error while validating a new game", err.message);
    res.sendStatus(500);
  }
}

export default validateGame;
