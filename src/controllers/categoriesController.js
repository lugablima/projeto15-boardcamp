import connection from "../dbStrategy/postgres.js";

export async function getCategories(req, res) {
  const { rows: categories } = await connection.query("SELECT * FROM categories");

  res.send(categories);
}

export async function createCategory(req, res) {
  //
}
