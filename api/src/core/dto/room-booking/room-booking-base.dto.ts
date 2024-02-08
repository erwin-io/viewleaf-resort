import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  Matches,
} from "class-validator";

export class DefaultRoomBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  roomNumber: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  checkInDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  checkOutDate: Date;
}
