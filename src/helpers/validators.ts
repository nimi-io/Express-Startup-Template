import Joi from "joi";
import { User } from "../types/db";

export const registerValidator = Joi.object<User>({
  username: Joi.string().alphanum().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});
export const loginValidator = Joi.object<User>({
  email: Joi.string().alphanum().required(),
  password: Joi.string().required(),
});
