import { NextFunction, Request, Response } from 'express';
import { authFactory } from '../services/factories/index';
import { ILogin } from '../types/auth';

export const loginController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const input: ILogin = {
		email: req.body.email,
		password: req.body.password,
	};
	const response = await authFactory().login(input);
	return res.status(response.code).json(response);
};
