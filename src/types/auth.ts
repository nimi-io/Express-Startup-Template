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

export interface VerifyTokenData {
  email: string;
  otp: number;
  token: string;
}

export interface ResetPasswordData {
  email: string;
  password: string;
  otp: number;
  token: string;
}
export interface emailOnly {
  email: string;
}
