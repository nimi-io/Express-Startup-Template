import mongoose, { Document, Schema } from "mongoose";
import { User } from "../types/db";

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  lastLoginDate: { type: Date },
  role: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<User>("Users", userSchema);

export { UserModel };
