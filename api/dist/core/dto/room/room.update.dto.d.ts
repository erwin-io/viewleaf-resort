import { DefaultRoomDto } from "./room-base.dto";
export declare class UpdateRoomDto extends DefaultRoomDto {
}
export declare class UpdateRoomStatusDto {
    status: "AVAILABLE" | "OCCUPIED" | "UPCOMING" | "INMAINTENANCE" | "UNAVAILABLE";
}
