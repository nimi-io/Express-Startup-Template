import { Response } from "express";
import enums from "../types/lib/index";

export default {
  response: (res: Response, code: number, json: unknown) => {
    res.status(code).json(json);
  },

  success: (
    res: Response,
    message: string,
    code: number,
    data: Record<string, unknown> | null
  ) =>
    res.status(code).json({
      status: enums.SUCCESS_STATUS,
      message,
      code,
      data: data || [],
    }),

  error: (
    res: Response,
    message = "",
    code = enums.HTTP_INTERNAL_SERVER_ERROR,
    label = ""
  ) => {
    const msg = code === 500 ? enums.HTTP_INTERNAL_SERVER_ERROR : message;
    console.error(`${message} - ${code} - ${label}`);
    return res.status(code).json({
      status: enums.ERROR_STATUS,
      message: msg,
      code,
    });
  },
};
