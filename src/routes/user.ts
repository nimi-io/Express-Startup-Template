import { Router } from "express";
import { notImplementedController } from "../controllers/auth";
import { verifyToken } from "../middlewares/verifyAuthToken";

const userRouter = Router();

userRouter.get("", verifyToken, notImplementedController);
userRouter.patch("", verifyToken, notImplementedController);

export default userRouter;
