import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultRoomBookingDto } from "./room-booking-base.dto";

export class UpdateRoomBookingDto extends DefaultRoomBookingDto {}

export class UpdateRoomBookingStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(["CONFIRMED", "CHECKED-IN", "CHECKED-OUT", "CANCELLED", "NO-SHOW"])
  @IsUppercase()
  status: "CONFIRMED" | "CHECKED-IN" | "CHECKED-OUT" | "CANCELLED" | "NO-SHOW";
}
