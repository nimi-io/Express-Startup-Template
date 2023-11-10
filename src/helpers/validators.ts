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
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const emailOnlyValidator = Joi.object<User>({
  email: Joi.string().email().required(),
});

export const verifyTokenValidator = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
  otp: Joi.number().required(),
});

export const resetPasswordValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  token: Joi.string().required(),
  otp: Joi.number().required(),
});
