import crypto from "crypto";
import config from "../../config/config";
import {
  ILogin,
  LoginData,
  emailOnly,
  VerifyTokenData,
  ResetPasswordData,
} from "../../types/auth";
import { ResultFunction } from "../../helpers/utils";
import enums from "../../types/lib/index";
import "reflect-metadata";
import { injectable, container } from "tsyringe";
import { AbstractRepository } from "./Abstract/database";
import { UserModel } from "../../models/user.model";
import { User } from "../../types/db";
import * as bcrypt from "bcrypt-nodejs";
import * as jwt from "jsonwebtoken";
import {
  emailOnlyValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifyTokenValidator,
} from "../../helpers/validators";
import emailSender from "../../helpers/email";

@injectable()
class Auth /*extends AbstractRepository<User>*/ {
  // constructor(private readonly Users: AbstractRepository<User>) {
  //   super(UserModel);
  // }
  Users: any;
  EmailSender: emailSender;
  constructor() {
    this.Users = new AbstractRepository(UserModel);
    this.EmailSender = new emailSender();
  }
  public async login(input: ILogin) {
    try {
      const { email, password } = input;
      const { error, value } = loginValidator.validate(input);
      if (error) {
        console.error(
          enums.CURRENT_DATE,
          enums.ERROR_STATUS,
          error,
          enums.SIGNUP_CONTROLLER
        );
        return ResultFunction(
          false,
          error.message,
          enums.HTTP_UNPROCESSABLE_ENTITY,
          enums.NOT_OK,
          null
        );
      }

      // check db
      const checkDatabase: User | null = await this.Users.findOne({ email });
      if (!checkDatabase || checkDatabase == null) {
        return ResultFunction(
          false,
          "invalid credentials",
          enums.HTTP_UNAUTHORIZED,
          enums.UNAUTHORIZED,
          null
        );
      }

      const verifyPassword = this.comparePassword(
        password,
        checkDatabase.password
      );
      if (!verifyPassword) {
        return ResultFunction(
          false,
          "invalid credentials",
          enums.HTTP_UNAUTHORIZED,
          enums.UNAUTHORIZED,
          null
        );
      }

      checkDatabase.password = "";
      const token = this.generateJwtToken({
        ...checkDatabase,
        dateGenerated: new Date(),
      });

      const data: LoginData = {
        token,
        user: {
          email,
          name: email.split("@")[0],
        },
      };

      console.log(
        enums.CURRENT_DATE,
        enums.HTTP_OK,
        enums.OK,
        enums.LOGIN_CONTROLLER
      );
      return ResultFunction(
        true,
        "login successful",
        enums.HTTP_OK,
        enums.OK,
        data
      );
    } catch (error: any) {
      console.error(error);

      return ResultFunction(
        false,
        enums.SOMETHING_WENT_WRONG,
        enums.HTTP_INTERNAL_SERVER_ERROR,
        enums.NOT_OK,
        null
      );
    }
  }
  public async register(input: User) {
    try {
      const { email, password, username, firstName, lastName } = input;

      const { error, value } = registerValidator.validate(input);
      if (error) {
        console.error(
          enums.CURRENT_DATE,
          enums.ERROR_STATUS,
          error,
          enums.SIGNUP_CONTROLLER
        );
        return ResultFunction(
          false,
          error.message,
          enums.HTTP_UNPROCESSABLE_ENTITY,
          enums.NOT_OK,
          null
        );
      }

      const userExist = await this.Users.findOne({ email });
      if (userExist) {
        console.error(
          enums.CURRENT_DATE,
          enums.HTTP_CONFLICT,
          enums.USER_ALREADY_EXISTS,
          enums.SIGNUP_CONTROLLER
        );
        return ResultFunction(
          false,
          enums.USER_ALREADY_EXISTS,
          enums.HTTP_UNPROCESSABLE_ENTITY,
          enums.NOT_OK,
          null
        );
      }

      const hashedPassword = this.hashPassword(password);

      const user = await this.Users.create({
        email,
        password: hashedPassword,
        username,
        firstName,
        lastName,
      });

      console.log(
        enums.CURRENT_DATE,
        enums.HTTP_CREATED,
        enums.CREATED,
        enums.SIGNUP_CONTROLLER
      );
      return ResultFunction(
        true,
        enums.SUCCESS_STATUS,
        enums.HTTP_CREATED,
        enums.OK,
        null
      );
    } catch (error: any) {
      console.error(error);

      return ResultFunction(
        false,
        enums.SOMETHING_WENT_WRONG,
        enums.HTTP_INTERNAL_SERVER_ERROR,
        enums.NOT_OK,
        null
      );
    }
  }

  public async generateToken(input: emailOnly) {
    try {
      const { error } = await emailOnlyValidator.validate(input);
      if (error) {
        console.error(
          enums.CURRENT_DATE,
          enums.ERROR_STATUS,
          error,
          enums.GENERATE_TOKEN_CONTROLLER
        );

        return ResultFunction(
          false,
          error.message,
          enums.HTTP_UNPROCESSABLE_ENTITY,
          enums.NOT_OK,
          null
        );
      }
      const { email } = input;
      const user = await this.Users.findOne({ email });
      if (!user) {
        console.error(
          enums.CURRENT_DATE,
          enums.HTTP_UNAUTHORIZED,
          enums.INVALID_TOKEN,
          enums.GENERATE_TOKEN_CONTROLLER
        );

        return ResultFunction(
          false,
          enums.INVALID_TOKEN,
          enums.HTTP_UNAUTHORIZED,
          enums.UNAUTHORIZED,
          null
        );
      }
      const otp = this.generateOtp();

      const token = this.generateRandomHashString();

      let currentDate = new Date();
      const updateOtpDetails = this.Users.findOneAndUpdate(user, {
        otpData: {
          otp,
          token,
          isExpired: enums.FALSE,
          expires: currentDate.setHours(
            currentDate.getHours() + config.OtpExpLenghInHr
          ),
        },
      });

      if (!updateOtpDetails) {
        console.error(
          enums.CURRENT_DATE,
          enums.SOMETHING_WENT_WRONG,
          enums.HTTP_UNPROCESSABLE_ENTITY,
          enums.NOT_OK,
          enums.GENERATE_TOKEN_CONTROLLER
        );

        return ResultFunction(
          false,
          enums.SOMETHING_WENT_WRONG,
          enums.HTTP_UNPROCESSABLE_ENTITY,
          enums.NOT_OK,
          null
        );
      }

      if (config.isProduction) {
        const result = await this.EmailSender.sendEmail(
          user.email,
          enums.OTP_GENERATED
        );

        console.log(
          enums.CURRENT_DATE,
          enums.HTTP_CREATED,
          enums.CREATED,
          enums.GENERATE_TOKEN_CONTROLLER
        );
        return ResultFunction(
          true,
          enums.CREATED,
          enums.HTTP_OK,
          enums.OK,
          enums.EMAIL_SENT
        );
      }
      console.log(
        enums.CURRENT_DATE,
        enums.HTTP_CREATED,
        enums.CREATED,
        enums.GENERATE_TOKEN_CONTROLLER
      );
      return ResultFunction(true, enums.CREATED, enums.HTTP_CREATED, enums.OK, {
        otp,
        token,
      });
    } catch (error) {
      console.error(error);
      return ResultFunction(
        false,
        enums.SOMETHING_WENT_WRONG,
        enums.HTTP_INTERNAL_SERVER_ERROR,
        enums.NOT_OK,
        null
      );
    }
  }
  public async verifyToken(input: VerifyTokenData) {
    try {
      const { value, error } = verifyTokenValidator.validate(input);
      if (error) {
        console.error(
          enums.CURRENT_DATE,
          enums.ERROR_STATUS,
          error,
          enums.VERIFY_TOKEN_CONTROLLER
        );

        return ResultFunction(
          false,
          error.message,
          enums.HTTP_UNPROCESSABLE_ENTITY,
          enums.NOT_OK,
          null
        );
      }
      const { email, token, otp } = input;

      const fetchUser = await this.Users.findOne({ email });
      if (!fetchUser) {
        console.error(
          enums.CURRENT_DATE,
          enums.HTTP_UNAUTHORIZED,
          enums.INVALID_TOKEN,
          enums.VERIFY_TOKEN_CONTROLLER
        );

        return ResultFunction(
          false,
          enums.INVALID_TOKEN,
          enums.HTTP_UNAUTHORIZED,
          enums.UNAUTHORIZED,
          null
        );
      }

      if (
        fetchUser.otpData.otp != otp &&
        fetchUser.otpData.otp != token &&
        !fetchUser.otpData.isExpired &&
        fetchUser.otpData.expires < new Date()
      ) {
        console.error(
          enums.CURRENT_DATE,
          enums.HTTP_UNAUTHORIZED,
          enums.INVALID_TOKEN,
          enums.VERIFY_TOKEN_CONTROLLER
        );

        return ResultFunction(
          false,
          enums.INVALID_TOKEN,
          enums.HTTP_UNAUTHORIZED,
          enums.EXPIRED_TOKEN,
          null
        );
      }

      console.log(
        enums.SUCCESS_STATUS,
        enums.HTTP_OK,
        enums.OK,
        enums.VERIFY_TOKEN_CONTROLLER
      );

      return ResultFunction(
        true,
        enums.SUCCESS_STATUS,
        enums.HTTP_OK,
        enums.OK,
        null
      );
    } catch (error) {
      return ResultFunction(
        false,
        enums.SOMETHING_WENT_WRONG,
        enums.HTTP_INTERNAL_SERVER_ERROR,
        enums.NOT_OK,
        null
      );
    }
  }
  public async resetPassword(input: ResetPasswordData) {
    try {
      const { error } = await resetPasswordValidator.validate(input);
      if (error) {
        console.error(
          enums.CURRENT_DATE,
          enums.ERROR_STATUS,
          error,
          enums.RESET_PASSWORD_CONTROLLER
        );

        return ResultFunction(
          false,
          error.message,
          enums.HTTP_UNPROCESSABLE_ENTITY,
          enums.NOT_OK,
          null
        );
      }
      const { email, password, otp, token } = input;

      const fetchUser = await this.Users.findOne({ email });
      if (!fetchUser) {
        console.error(
          enums.CURRENT_DATE,
          enums.HTTP_UNAUTHORIZED,
          enums.INVALID_TOKEN,
          enums.RESET_PASSWORD_CONTROLLER
        );

        return ResultFunction(
          false,
          enums.INVALID_TOKEN,
          enums.HTTP_UNAUTHORIZED,
          enums.UNAUTHORIZED,
          null
        );
      }

      if (
        !(
          fetchUser.otpData.otp == otp &&
          fetchUser.otpData.token == token &&
          !fetchUser.otpData.isExpired &&
          fetchUser.otpData.expires < new Date()
        )
      ) {
        console.error(
          enums.CURRENT_DATE,
          enums.HTTP_UNAUTHORIZED,
          enums.INVALID_TOKEN,
          enums.VERIFY_TOKEN_CONTROLLER
        );

        return ResultFunction(
          false,
          enums.INVALID_TOKEN,
          enums.HTTP_UNAUTHORIZED,
          enums.EXPIRED_TOKEN,
          null
        );
      }
      const hashedPassword = this.hashPassword(password);
      const updatePassword = await this.Users.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
          "otpData.isExpired": true,
        }
      );
      if (!updatePassword) {
        console.error(
          enums.CURRENT_DATE,
          enums.HTTP_UNAUTHORIZED,
          enums.INVALID_TOKEN,
          enums.RESET_PASSWORD_CONTROLLER
        );

        return ResultFunction(
          false,
          enums.INVALID_TOKEN,
          enums.HTTP_UNAUTHORIZED,
          enums.UNAUTHORIZED,
          null
        );
      }
      console.log(
        enums.CURRENT_DATE,
        enums.HTTP_OK,
        enums.OK,
        enums.RESET_PASSWORD_CONTROLLER
      );
      return ResultFunction(
        true,
        enums.SUCCESS_STATUS,
        enums.HTTP_OK,
        enums.OK,
        null
      );
    } catch {
      console.error(
        enums.CURRENT_DATE,
        enums.HTTP_UNAUTHORIZED,
        enums.INVALID_TOKEN,
        enums.RESET_PASSWORD_CONTROLLER
      );

      return ResultFunction(
        false,
        enums.INVALID_TOKEN,
        enums.HTTP_INTERNAL_SERVER_ERROR,
        enums.BAD_REQUEST,
        null
      );
    }
  }
  ///////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  comparePassword(candidatePassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, hashedPassword);
  }

  generateJwtToken(user: Record<string, any>): string {
    const token = jwt.sign(user, config.JwtToken);
    return token;
  }

  generateOtp(): number {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  generateRandomHashString(): string {
    const randomNumber = Math.random().toString();
    const hash = crypto.createHash("sha256").update(randomNumber).digest("hex");
    return hash;
  }
}

export default Auth;
