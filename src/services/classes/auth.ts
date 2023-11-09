import crypto from "crypto";
import { ILogin, LoginData } from "../../types/auth";
import { ResultFunction } from "../../helpers/utils";
import enums from "../../types/lib/index";
import "reflect-metadata";
import { injectable, container } from "tsyringe";
import { AbstractRepository } from "./database";
import { UserModel } from "../../models/user.model";
import { User } from "../../types/db";
import * as bcrypt from "bcrypt-nodejs";
import config from "../../config/config";
import * as jwt from "jsonwebtoken";
import { loginValidator, registerValidator } from "../../helpers/validators";
import { Model } from "mongoose";

@injectable()
class Auth /*extends AbstractRepository<User>*/ {
  // constructor(private readonly Users: AbstractRepository<User>) {
  //   super(UserModel);
  // }
  Users: any;
  constructor() {
    this.Users = new AbstractRepository(UserModel);
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
        "something went wrong",
        enums.HTTP_UNPROCESSABLE_ENTITY,
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
        "something went wrong",
        422,
        enums.NOT_OK,
        null
      );
    }
  }

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
}

export default Auth;
