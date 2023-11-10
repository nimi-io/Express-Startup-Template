import mongoose, { Document, Schema } from "mongoose";
import { User } from "../types/db";

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  otpData: {
    otp: { type: Number, required: false },
    token: { type: String, required: false },
    isExpired: { type: Boolean, required: false },
    expires: { type: Date, required: false },
  },
  lastLoginDate: { type: Date },
  role: { type: String },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

const UserModel = mongoose.model<User>("Users", userSchema);

export { UserModel };
