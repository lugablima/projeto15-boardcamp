import { stripHtml } from "string-strip-html";
import connection from "../dbStrategy/postgres.js";
import gameSchema from "../schemas/gamesSchema.js";

async function validateGame(req, res, next) {
  const game = req.body;

  const { error } = gameSchema.validate(game, { abortEarly: false });

  if (error) {
    return res.status(400).send(error.details.map((el) => ({ message: el.message })));
  }

  game.name = stripHtml(game.name).result.trim();
  game.image = game.image.trim();

  try {
    const {
      rows: [category],
    } = await connection.query("SELECT FROM categories WHERE id = $1", [game.categoryId]);

    if (!category) return res.sendStatus(400);

    const { rows } = await connection.query("SELECT * FROM games WHERE name ILIKE $1", [`${game.name}`]);
    const gameAlreadyExist = rows[0];

    if (gameAlreadyExist) return res.status(409).send("Esse jogo já existe!");

    res.locals.game = game;

    next();
  } catch (err) {
    console.log("Error validating a new game", err.message);
    res.sendStatus(500);
  }
}

export default validateGame;
