import { Router } from "express";
import { loginController, notImplementedController, registerController } from "../controllers/auth";

const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);

authRouter.post("/logout", notImplementedController);
authRouter.post("/generatToken", notImplementedController);
authRouter.post("/verifyToken", notImplementedController);
authRouter.post("/resetPassword", notImplementedController);


export default authRouter;
