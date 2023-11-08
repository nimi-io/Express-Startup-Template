import { Request, Response, Router } from 'express';
import authRouter from './auth';
import { ResultFunction } from '../helpers/utils';
import { ReturnStatus } from '../types/generic';

const apiRouter = Router();

// define your routes
apiRouter.use('/auth', authRouter);

apiRouter.use('/hello', (req: Request, res: Response) => {
	const data = ResultFunction(
		true,
		'Welcome to monitree api v1.0',
		200,
		ReturnStatus.OK,
		null
	);
	return res.status(data.code).json(data);
});

export default apiRouter;
