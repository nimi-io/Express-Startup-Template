import mongoose, { Document } from "mongoose";

export interface IPaginateResult<T> {
  data: T;
  meta: IMeta;
}

export interface IDefaultPaginationOptions {
  limit: number;
  page: number;
}

export interface IMeta {
  totalItems: number;
  count: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface IGetMetaProps<T> {
  total: number;
  data: T[];
  limit: number;
  page: number;
}

interface Token {
  otp: string;
  token: string;
  isExpired: boolean;
  expires: Date;
}

export interface User extends Document {
  _id?: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;

  otpData?: Token;
  lastLoginDate?: Date;
  role: string;
  createdAt: Date;
  updatedAt?: Date;
}
