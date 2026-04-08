import joi from "joi";
import { roles } from "../../DB/models/user.model.js";

export const changeUserRole = joi.object({
  userId: joi.string().required(),
  role: joi
    .string()
    .valid(...Object.values(roles))
    .required(),
});
