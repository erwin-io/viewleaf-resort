import { Transform } from "class-transformer";
import { DefaultRoomBookingDto } from "./room-booking-base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreateRoomBookingDto extends DefaultRoomBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  bookedByUserCode: string;
}
