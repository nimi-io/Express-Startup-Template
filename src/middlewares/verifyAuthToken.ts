import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import enums from "../types/lib/index";
import { RequestExtUser } from "../types/auth";
import { ResultFunction } from "../helpers/utils";

function verifyToken(req: RequestExtUser, res: Response, next: NextFunction) {
  let token: string | undefined =
    req.headers["authorization"] || req.query.token || req.cookies.token;

  if (!token) {
    console.error(
      enums.CURRENT_DATE,
      enums.HTTP_UNAUTHORIZED,
      enums.INVALID_TOKEN,
      enums.VERIFY_TOKEN_CONTROLLER
    );
    return ResultFunction(
      false,
      enums.INVALID_TOKEN,
      enums.HTTP_UNAUTHORIZED,
      enums.UNAUTHORIZED,
      null
    );
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }
    
  jwt.verify(token, config.JwtToken, (err: any, decoded: any) => {
    if (err) {
      console.error(
        enums.CURRENT_DATE,
        enums.HTTP_UNAUTHORIZED,
        enums.INVALID_TOKEN,
        enums.VERIFY_TOKEN_CONTROLLER
      );

      return ResultFunction(
        false,
        enums.INVALID_TOKEN,
        enums.HTTP_UNAUTHORIZED,
        enums.UNAUTHORIZED,
        null
      );
    }

    req.user = decoded as Record<string, any>;

    next();
  });
}
