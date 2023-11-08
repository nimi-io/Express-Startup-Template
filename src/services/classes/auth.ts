import crypto from 'crypto';
import { ILogin, LoginData } from '../../types/auth';
import { ResultFunction } from '../../helpers/utils';
import { ReturnStatus } from '../../types/generic';

class Auth {
	public async login(input: ILogin) {
		try {
			const { email, password } = input;
			// validation
			if (password !== 'password') {
				return ResultFunction(
					false,
					'invalid credentials',
					401,
					ReturnStatus.UNAUTHORIZED,
					null
				);
			}

			// check db

			// generate access token
			const token = crypto.randomBytes(32).toString('hex');
			const data: LoginData = {
				token,
				user: {
					email,
					name: email.split('@')[0],
				},
			};
			return ResultFunction(
				true,
				'login successful',
				200,
				ReturnStatus.OK,
				data
			);
		} catch (error: any) {
			console.error(error);
			return ResultFunction(
				false,
				'something went wrong',
				422,
				ReturnStatus.NOT_OK,
				null
			);
		}
	}
}

export default Auth;
