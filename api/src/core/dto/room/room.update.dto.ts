import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsIn, IsUppercase } from "class-validator";
import { DefaultRoomDto } from "./room-base.dto";

export class UpdateRoomDto extends DefaultRoomDto {}

export class UpdateRoomStatusDto {
  @ApiProperty({
    type: String,
    default: "",
  })
  @IsNotEmpty()
  @IsIn(["AVAILABLE", "OCCUPIED", "BOOKED", "INMAINTENANCE", "UNAVAILABLE"])
  @IsUppercase()
  status:
    | "AVAILABLE"
    | "OCCUPIED"
    | "UPCOMING"
    | "INMAINTENANCE"
    | "UNAVAILABLE";
}
