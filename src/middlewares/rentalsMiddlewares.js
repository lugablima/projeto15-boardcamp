import connection from "../dbStrategy/postgres.js";
import rentalSchema from "../schemas/rentalsSchema.js";

async function validateRental(req, res, next) {
  const rental = req.body;

  const { error } = rentalSchema.validate(rental, { abortEarly: false });

  if (error) {
    return res.status(400).send(error.details.map((err) => ({ message: err.message })));
  }

  try {
    const {
      rows: [customer],
    } = await connection.query("SELECT * FROM customers WHERE id = $1", [rental.customerId]);
    const {
      rows: [game],
    } = await connection.query("SELECT * FROM games WHERE id = $1", [rental.gameId]);

    if (!customer || !game) return res.sendStatus(400);

    const { rows: openRentals } = await connection.query(
      `SELECT * FROM rentals
    WHERE "gameId" = $1 AND "returnDate" IS NULL`,
      [rental.gameId]
    );

    const {
      rows: [chosenGame],
    } = await connection.query(
      `SELECT * FROM games
    WHERE id = $1`,
      [rental.gameId]
    );

    if (openRentals.length >= chosenGame.stockTotal) return res.sendStatus(400);

    res.locals = { rental, game: chosenGame };

    next();
  } catch (err) {
    console.log("Error validating a new rental", err.message);
    res.sendStatus(500);
  }
}

export default validateRental;
