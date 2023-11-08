export interface ILogin {
	email: string;
	password: string;
}

export type LoginData = {
	user: {
		email: string;
		name: string;
	};
	token: string;
};
