import { Request, Response, Router } from "express";
import authRouter from "./auth";
import { ResultFunction } from "../helpers/utils";
import enums from "../types/lib/index";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/hello", (req: Request, res: Response) => {
  const data = ResultFunction(
    true,
    "Welcome to monitree api v1.0",
    200,
    enums.OK,
    null
  );
  return res.status(data.code).json(data);
});

export default apiRouter;
