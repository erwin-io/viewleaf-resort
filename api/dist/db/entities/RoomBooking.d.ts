import { Users } from "./Users";
import { Room } from "./Room";
export declare class RoomBooking {
    roomBookingId: string;
    roomBookingCode: string | null;
    dateCreated: Date;
    dateLastUpdated: Date | null;
    checkInDate: Date;
    checkOutDate: Date;
    roomRateAmount: string;
    otherCharges: string;
    totalAmount: string;
    status: string;
    guest: string;
    bookedByUser: Users;
    room: Room;
}
