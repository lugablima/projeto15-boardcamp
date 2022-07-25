import connection from "../dbStrategy/postgres.js";

export async function getCategories(req, res) {
  try {
    const { rows: categories } = await connection.query("SELECT * FROM categories ORDER BY id ASC");

    res.send(categories);
  } catch (err) {
    console.log("Error getting categories", err.message);
    return res.sendStatus(500);
  }
}

export async function createCategory(req, res) {
  const { category } = res.locals;

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [category.name]);

    res.sendStatus(201);
  } catch (err) {
    console.log("Error creating a new category", err.message);
    return res.sendStatus(500);
  }
}
