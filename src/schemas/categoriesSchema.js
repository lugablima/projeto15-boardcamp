import joi from "joi";

const categorySchema = joi.object({
  name: joi.string().trim().required(),
});

export default categorySchema;
