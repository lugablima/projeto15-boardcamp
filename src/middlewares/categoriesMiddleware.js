import { stripHtml } from "string-strip-html";
import categorySchema from "../schemas/categoriesSchema.js";
import connection from "../dbStrategy/postgres.js";

async function validateCategory(req, res, next) {
  const category = req.body;

  const { error } = categorySchema.validate(category);

  if (error) {
    return res.status(400).send(error.details.map((err) => ({ message: err.message })));
  }

  category.name = stripHtml(category.name).result.trim();

  try {
    const { rows: categoryAlreadyExist } = await connection.query("SELECT * FROM categories WHERE name ILIKE $1", [`${category.name}`]);

    if (categoryAlreadyExist.length) return res.status(409).send("Essa categoria já existe!");

    res.locals.category = category;

    next();
  } catch (err) {
    console.log("Error validating a category", err.message);
    return res.sendStatus(500);
  }
}

export default validateCategory;
