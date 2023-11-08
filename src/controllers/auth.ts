import { NextFunction, Request, Response } from "express";
import { authFactory } from "../services/factories/index";
import { ILogin } from "../types/auth";
import API from "../helpers/http";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input: ILogin = {
    email: req.body.email,
    password: req.body.password,
  };
  const response = await authFactory().login(input);
  return API.response(res, response.code, response); //res.status(response.code).json(response);
};
