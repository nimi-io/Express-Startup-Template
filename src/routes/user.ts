import { Router } from "express";
import {
  notImplementedController,
} from "../controllers/auth";

const userRouter = Router();

userRouter.get("", notImplementedController);
userRouter.patch("", notImplementedController);

export default userRouter;
