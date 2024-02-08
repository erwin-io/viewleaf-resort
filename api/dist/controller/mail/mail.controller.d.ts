import { UserConfirmationMailDto } from "src/core/dto/mail/mail.create.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { MailService } from "src/services/mail.service";
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    create(mailDto: UserConfirmationMailDto): Promise<ApiResponseModel<any>>;
}
