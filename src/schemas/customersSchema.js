import Joi from "joi";
import joiDate from "@joi/date";

const joi = Joi.extend(joiDate);

const regexCPF = /^[0-9]{11}$/;
const regexPhone = /^[0-9]{10,11}$/;

const customerSchema = joi.object({
  name: joi.string().trim().required(),
  phone: joi.string().pattern(regexPhone).required(),
  cpf: joi.string().pattern(regexCPF).required(),
  birthday: joi.date().iso().required(),
});

export default customerSchema;
