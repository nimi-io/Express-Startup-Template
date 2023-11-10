import config from "../config/config";
import * as postmark from "postmark";
import { ResultFunction } from "./utils";
import enums from "../types/lib/index";

class EmailSender {
  private client: postmark.ServerClient;

  constructor() {
    this.client = new postmark.ServerClient(config.PostMarkApiKeyL);
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody?: string,
    from = "noreply@server.com",
    cc = "ibukunoluwaodunsi@gmail.com"
  ) {
    const email = await this.client.sendEmail({
      From: from,
      To: to,
      Cc: cc,
      Subject: subject,
      HtmlBody: htmlBody,
    });
  }
}

export default EmailSender;
