import categorySchema from "../schemas/categoriesSchema.js";
import connection from "../dbStrategy/postgres.js";

async function validateCategory(req, res, next) {
  const category = req.body;

  const { error } = categorySchema.validate(category);

  if (error && error.details[0].type === "string.empty") {
    return res.status(400).send("A propriedade 'name' não pode estar vazia!");
  }

  if (error) return res.sendStatus(422);

  try {
    const { rows: categoryAlreadyExist } = await connection.query("SELECT * FROM categories WHERE name = $1", [category.name]);

    if (categoryAlreadyExist.length) return res.status(409).send("Essa categoria já existe!");

    res.locals.category = category;

    next();
  } catch (err) {
    console.log("Error while validating a category", err.message);
    return res.sendStatus(500);
  }
}

export default validateCategory;
