import { Transform, Type } from "class-transformer";
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Match } from "../match.decorator.dto";
import { ApiProperty } from "@nestjs/swagger";
import { DefaultUserDto } from "../user/user-base.dto";

export class UserConfirmationCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  confirmationCode: string;
}