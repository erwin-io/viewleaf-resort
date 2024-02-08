import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { UserConfirmationMailDto } from "src/core/dto/mail/mail.create.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { MailService } from "src/services/mail.service";

@ApiTags("mail")
@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post("userConfirmation")
  //   @UseGuards(JwtAuthGuard)
  async create(@Body() mailDto: UserConfirmationMailDto) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.mailService.sendUserEmailConfirmation(mailDto);
      res.success = true;
      res.message = `Mail Sent!`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
