import joi from "joi";
import connection from "../dbStrategy/postgres.js";

// async function renderListValidCategories() {
//   const { rows: categoriesIds } = await connection.query("SELECT id FROM categories");

//   return categoriesIds.map((el) => el.id);
// }

// Falta adicionar o regex para verificar a extensão da imagem

const { rows: categoriesIds } = await connection.query("SELECT id FROM categories");

const listValidCategories = categoriesIds.map((el) => el.id);

const gameSchema = joi.object({
  name: joi.string().trim().required(),
  image: joi.string().uri().required(),
  stockTotal: joi.number().integer().positive().required(),
  categoryId: joi
    .number()
    .integer()
    .valid(...listValidCategories)
    .required(),
  pricePerDay: joi.number().integer().positive().required(),
});

export default gameSchema;
