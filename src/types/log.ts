export interface IAuditLog extends Document {
  user: string;
  action: string;
  status: string;
  createdAt: Date;
}
