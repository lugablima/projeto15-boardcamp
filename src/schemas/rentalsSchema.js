import joi from "joi";
import connection from "../dbStrategy/postgres.js";

let { rows: customers } = await connection.query("SELECT * FROM customers ORDER BY id ASC");
let { rows: games } = await connection.query("SELECT * FROM games ORDER BY id ASC");

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
