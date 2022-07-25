import joi from "joi";
import connection from "../dbStrategy/postgres.js";

async function renderListValidCategories() {
  const { rows: categoriesIds } = await connection.query("SELECT id FROM categories ORDER BY id ASC");

  return categoriesIds.map((el) => el.id);
}

const regexImageExtension = /\.(jpg|png|jpeg|svg)$/;

const listValidCategories = await renderListValidCategories();

const gameSchema = joi.object({
  name: joi.string().trim().required(),
  image: joi.string().uri().pattern(regexImageExtension).required(),
  stockTotal: joi.number().integer().positive().required(),
  categoryId: joi
    .number()
    .integer()
    .valid(...listValidCategories)
    .required(),
  pricePerDay: joi.number().integer().positive().required(),
});

export default gameSchema;

// const { rows: categoriesIds } = await connection.query("SELECT id FROM categories");

// const listValidCategories = categoriesIds.map((el) => el.id);
