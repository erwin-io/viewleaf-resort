import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { UserConfirmationMailDto } from "src/core/dto/mail/mail.create.dto";
export declare class MailService {
    private mailerService;
    private config;
    constructor(mailerService: MailerService, config: ConfigService);
    create(dto: UserConfirmationMailDto): Promise<SentMessageInfo>;
    sendUserEmailConfirmation(dto: UserConfirmationMailDto): Promise<SentMessageInfo>;
}
