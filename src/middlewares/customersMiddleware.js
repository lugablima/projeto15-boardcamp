import connection from "../dbStrategy/postgres.js";
import customerSchema from "../schemas/customersSchema.js";

async function validateCustomer(req, res, next) {
  const customer = req.body;

  const { error } = customerSchema.validate(customer, { abortEarly: false });

  if (error) {
    return res.status(400).send(error.details.map((err) => ({ message: err.message })));
  }

  try {
    const { rows: customerAlreadyExist } = await connection.query(
      `
    SELECT * FROM customers
    WHERE cpf = $1`,
      [customer.cpf]
    );

    if (customerAlreadyExist[0]) return res.status(409).send("Esse cliente já existe!");

    console.log("antes", customer.birthday);

    customer.birthday = customer.birthday.slice(0, 10);

    console.log("depois", customer.birthday);

    // Falta fazer a sanitização dos dados e o trim()

    res.locals.customer = customer;

    next();
  } catch (err) {
    console.log("Error while validating customer", err.message);
    res.sendStatus(500);
  }
}

export default validateCustomer;
