import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUppercase,
  Matches,
  ValidateNested,
} from "class-validator";

export class DefaultRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^\S*$/)
  roomNumber: string;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNumberString()
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  adultCapacity: number;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNumberString()
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  childrenCapacity: number;

  @ApiProperty({
    default: 0,
    type: Number
  })
  @IsNumberString()
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ obj, key }) => {
    return obj[key].toString();
  })
  roomRate: number;

  @ApiProperty()
  @IsNotEmpty()
  roomTypeId: string;

  @ApiProperty()
  @IsOptional()
  thumbnailFile: any;
}
