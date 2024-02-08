/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { extname } from "path";
import { generateIndentityCode } from "src/common/utils/utils";
import { UserConfirmationMailDto } from "src/core/dto/mail/mail.create.dto";
import { Files } from "src/db/entities/Files";

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService
  ) {}

  async create(dto: UserConfirmationMailDto) {
    const context = {
      name: dto.name,
      appUrl: this.config.get("APP_URL"),
      appName: this.config.get("MAIL_APP_NAME"),
      banner: this.config.get("MAIL_BANNER"),
    };
    return await this.mailerService.sendMail({
      to: dto.to,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "Welcome to Nice App! Confirm your Email",
      template: "./transactional", // either change to ./transactional or rename transactional.html to confirmation.html
      context,
    });
  }

  async sendUserEmailConfirmation(dto: UserConfirmationMailDto) {
    const context = {
      name: dto.name,
      url: `${this.config.get("APP_URL")}/auth/confirm/${dto.code}`,
      appUrl: this.config.get("APP_URL"),
      appName: this.config.get("MAIL_APP_NAME"),
      banner: this.config.get("MAIL_BANNER"),
    };
    return await this.mailerService.sendMail({
      to: dto.to,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `${this.config.get("AUTH_CONFIRMATION_SUBJECT")}`,
      template: `${this.config.get("AUTH_CONFIRMATION_TEMPLATE")}`, // either change to ./transactional or rename transactional.html to confirmation.html
      context,
    });
  }
}
