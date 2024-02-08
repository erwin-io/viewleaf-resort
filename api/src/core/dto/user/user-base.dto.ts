import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUppercase,
  ValidateNested,
  isNotEmpty,
} from "class-validator";

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}

export class DefaultUserDto {
  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  mobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  birthDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["MALE", "FEMALE", "OTHERS"])
  @IsUppercase()
  gender: "MALE" | "FEMALE" | "OTHERS";

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ default: "example@email.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateProfilePictureDto {
  @ApiProperty()
  @IsOptional()
  userProfilePic: any;
}
