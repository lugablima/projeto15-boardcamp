import connection from "../dbStrategy/postgres.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;
  try {
    let customers;

    if (!cpf) {
      const { rows } = await connection.query(`SELECT * FROM customers`);
      customers = rows;
    } else {
      const { rows } = await connection.query(
        `SELECT * FROM customers
         WHERE cpf LIKE $1`,
        [`${cpf}%`]
      );

      customers = rows;
    }

    res.send(customers);
  } catch (err) {
    console.log("Error while getting customers", err.message);
    res.sendStatus(500);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const { rows: customer } = await connection.query(
      `SELECT * FROM customers
       WHERE id = $1`,
      [id]
    );

    if (!customer[0]) return res.sendStatus(404);

    res.send(customer[0]);
  } catch (err) {
    console.log("Error while getting customer by id", err.message);
    res.sendStatus(500);
  }
}
