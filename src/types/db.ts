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

export interface User extends Document {
  _id?: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;

  lastLoginDate?: Date;
  role: string;
  createdAt: Date;
  updatedAt?: Date;
}