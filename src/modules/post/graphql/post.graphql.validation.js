import joi from "joi";

export const onePostSchema = joi.object({
  id: joi.string().required().min(3),
});
