import { stripHtml } from "string-strip-html";
import connection from "../dbStrategy/postgres.js";
import customerSchema from "../schemas/customersSchema.js";

async function validateCustomer(req, res, next) {
  const customer = req.body;
  const { id } = req.params;

  const { error } = customerSchema.validate(customer, { abortEarly: false });

  if (error) {
    return res.status(400).send(error.details.map((err) => ({ message: err.message })));
  }

  customer.name = stripHtml(customer.name).result.trim();

  try {
    let customerAlreadyExist;

    if (req.method === "PUT") {
      const { rows } = await connection.query(
        `SELECT * FROM customers
        WHERE cpf = $1 AND id <> $2`,
        [customer.cpf, id]
      );

      customerAlreadyExist = rows;
    } else {
      const { rows } = await connection.query(
        `SELECT * FROM customers
        WHERE cpf = $1`,
        [customer.cpf]
      );

      customerAlreadyExist = rows;
    }

    if (customerAlreadyExist[0]) return res.status(409).send("Esse cliente já existe!");

    res.locals.customer = customer;

    next();
  } catch (err) {
    console.log("Error validating customer", err.message);
    res.sendStatus(500);
  }
}

export default validateCustomer;
