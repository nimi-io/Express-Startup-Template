import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import API from "../helpers/http";
import enums from "../types/lib/index";
import { RequestExtUser } from "../types/auth";
import { ResultFunction } from "../helpers/utils";

export const verifyToken = (
  req: RequestExtUser,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined =
      req.headers["authorization"] ||
      req.query.token ||
      req.cookies.token ||
      undefined;
    if (token === undefined || !token) {
      console.error(
        enums.CURRENT_DATE,
        enums.HTTP_UNAUTHORIZED,
        enums.INVALID_TOKEN,
        enums.VERIFY_TOKEN_CONTROLLER
      );
      const response = ResultFunction(
        false,
        enums.INVALID_TOKEN,
        enums.HTTP_UNAUTHORIZED,
        enums.UNAUTHORIZED,
        null
      );
      return API.response(res, response.code, response);
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, config.JwtToken);
    if (!decoded) {
      console.error(
        enums.CURRENT_DATE,
        enums.HTTP_UNAUTHORIZED,
        enums.INVALID_TOKEN,
        enums.VERIFY_TOKEN_MIDDLEWARE
      );

      const response = ResultFunction(
        false,
        enums.INVALID_TOKEN,
        enums.HTTP_UNAUTHORIZED,
        enums.UNAUTHORIZED,
        null
      );
      return API.response(res, response.code, response);
    }

    req.user = decoded as Record<string, any>;

    next();
  } catch (error) {
    console.error(
      enums.CURRENT_DATE,
      enums.HTTP_INTERNAL_SERVER_ERROR,
      enums.INVALID_TOKEN,
      enums.VERIFY_TOKEN_MIDDLEWARE
    );

    const response = ResultFunction(
      false,
      enums.INVALID_TOKEN,
      enums.HTTP_INTERNAL_SERVER_ERROR,
      enums.UNAUTHORIZED,
      null
    );
    return API.response(res, response.code, response);
  }
};
