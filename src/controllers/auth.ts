import { NextFunction, Request, Response } from "express";
import { authFactory } from "../services/factories/index";
import { ILogin } from "../types/auth";
import API from "../helpers/http";
import enums from "../types/lib/index";

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

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = req.body;
  const response = await authFactory().register(input);
  return API.response(res, response.code, response);
};

export const generatTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = req.body;
  const response = await authFactory().generateToken(input);
  return API.response(res, response.code, response); //res.status(response.code).json(response);
};

export const verifyTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = req.body;
  const response = await authFactory().verifyToken(input);
  return API.response(res, response.code, response); //res.status(response.code).json(response);
};
export const resetPasswordControlle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = req.body;
  const response = await authFactory().resetPassword(input);
  return API.response(res, response.code, response); //res.status(response.code).json(response);
};

export const notImplementedController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(
    enums.CURRENT_DATE,
    enums.HTTP_NOT_IMPLEMENTED,
    enums.NOT_IMPLEMENTED,
    enums.NOT_IMPLEMENTED_CONTROLLER
  );
  return API.response(res, enums.HTTP_NOT_IMPLEMENTED, {
    msg: enums.NOT_IMPLEMENTED,
  });
};
