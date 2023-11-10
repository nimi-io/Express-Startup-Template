import "reflect-metadata";
import { injectable } from "tsyringe";
import { AbstractRepository } from "./database";
import { AuditLog } from "../../../models/log.model";
import { IAuditLog } from "../../../types/log";

@injectable()
class Log {
  LogModel: any;
  constructor() {
    this.LogModel = new AbstractRepository(AuditLog);
  }

  async createLog(input: IAuditLog) {
    return await this.LogModel.create(input);
  }
}
export default Log;
