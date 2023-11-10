import { Router } from "express";
import {
  generatTokenController,
  loginController,
  notImplementedController,
  registerController,
  resetPasswordControlle,
  verifyTokenController,
} from "../controllers/auth";

const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);

authRouter.post("/logout", notImplementedController);
authRouter.post("/generatToken", generatTokenController);
authRouter.post("/verifyToken", verifyTokenController);
authRouter.post("/resetPassword", resetPasswordControlle);


export default authRouter;
