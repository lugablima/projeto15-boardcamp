import joi from "joi";
import connection from "../dbStrategy/postgres.js";

let { rows: customers } = await connection.query("SELECT * FROM customers");
let { rows: games } = await connection.query("SELECT * FROM games");

customers = customers.map((customer) => customer.id);
games = games.map((game) => game.id);

const rentalSchema = joi.object({
  customerId: joi
    .number()
    .integer()
    .valid(...customers)
    .required(),
  gameId: joi
    .number()
    .integer()
    .valid(...games)
    .required(),
  daysRented: joi.number().integer().positive().required(),
});

export default rentalSchema;
