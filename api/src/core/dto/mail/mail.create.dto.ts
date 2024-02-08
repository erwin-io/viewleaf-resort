import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
  IsUrl,
} from "class-validator";
import { DefaultMailDto } from "./mail-base.dto";

export class UserConfirmationMailDto extends DefaultMailDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  code: string;
}
