export interface IAuditLog {
  user: string;
  action: string;
  status: string;
  createdAt: Date;
}
