import mongoose, { Schema, Document } from "mongoose";
import { IAuditLog } from "../types/log";

const AuditLogSchema: Schema = new Schema<IAuditLog>({
  user: { type: String, required: true },
  action: { type: String, required: true },
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export { AuditLog };
