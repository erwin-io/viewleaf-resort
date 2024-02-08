import { RoomType } from "./RoomType";
import { Files } from "./Files";
import { RoomBooking } from "./RoomBooking";
export declare class Room {
    roomId: string;
    roomNumber: string;
    adultCapacity: string;
    childrenCapacity: string;
    roomRate: string;
    dateAdded: Date;
    dateLastUpdated: Date | null;
    status: string;
    active: boolean;
    roomType: RoomType;
    thumbnailFile: Files;
    roomBookings: RoomBooking[];
}
