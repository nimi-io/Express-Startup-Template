import { Router } from 'express';
import { loginController } from '../controllers/auth';

const authRouter = Router();

authRouter.post('/login', loginController);

export default authRouter;
