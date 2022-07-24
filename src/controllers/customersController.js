import connection from "../dbStrategy/postgres.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;
  try {
    let customers;

    if (!cpf) {
      const { rows } = await connection.query(`
      SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday 
      FROM customers`);
      customers = rows;
    } else {
      const { rows } = await connection.query(
        `SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday 
         FROM customers
         WHERE cpf LIKE $1`,
        [`${cpf}%`]
      );

      customers = rows;
    }

    // SELECT to_char(birthday, 'YYYY-MM-DD') as birthday FROM customers;

    // Falta descobrir pq ele está retornando o horário no birthday

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
      `SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday  
       FROM customers
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

export async function createCustomer(req, res) {
  const {
    customer: { name, phone, cpf, birthday },
  } = res.locals;

  try {
    await connection.query(
      `
    INSERT INTO customers 
    (name, phone, cpf, birthday) 
    VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (err) {
    console.log("Error while creating a new customer", err.message);
    res.sendStatus(500);
  }
}

export async function updateCustomer(req, res) {
  const { id } = req.params;
  const {
    customer: { name, phone, cpf, birthday },
  } = res.locals;

  try {
    await connection.query(
      `UPDATE customers 
    SET name = $1, phone = $2, cpf = $3, birthday = $4
    WHERE id = $5`,
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (err) {
    console.log("Error while updating customer", err.message);
    res.sendStatus(500);
  }
}
