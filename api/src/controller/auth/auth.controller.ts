import { LocalAuthGuard } from "../../core/auth/local.auth.guard";
import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Headers,
  Query,
} from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import { REGISTER_SUCCESS } from "src/common/constant/api-response.constant";
import { RegisterGuestUserDto } from "src/core/dto/auth/register.dto";
import { Users } from "src/db/entities/Users";
import { UserConfirmationCodeDto } from "src/core/dto/auth/user-confirmation.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/guest")
  public async registerGuest(@Body() createUserDto: RegisterGuestUserDto) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.authService.registerGuest(createUserDto);
      res.success = true;
      res.message = `${REGISTER_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("confirmUser")
  public async confirmUser(@Body() dto: UserConfirmationCodeDto) {
    const res: ApiResponseModel<Users> = {} as any;
    try {
      res.data = await this.authService.confirmUser(dto);
      res.success = true;
      res.message = `${REGISTER_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("login/staff")
  public async loginStaff(@Body() loginUserDto: LogInDto) {
    const res: ApiResponseModel<Users> = {} as ApiResponseModel<Users>;
    try {
      res.data = await this.authService.getStaffByCredentials(loginUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("login/guest")
  public async loginGuest(@Body() loginUserDto: LogInDto) {
    const res: ApiResponseModel<Users> = {} as ApiResponseModel<Users>;
    try {
      res.data = await this.authService.getGuestByCredentials(loginUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
