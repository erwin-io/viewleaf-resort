import { DefaultRoomBookingDto } from "./room-booking-base.dto";
export declare class UpdateRoomBookingDto extends DefaultRoomBookingDto {
}
export declare class UpdateRoomBookingStatusDto {
    status: "CONFIRMED" | "CHECKED-IN" | "CHECKED-OUT" | "CANCELLED" | "NO-SHOW";
}
