import { Room } from './room.model';
import { Users } from './users';
export class RoomBooking {
  roomBookingId: string;
  roomBookingCode: string;
  dateCreated: Date;
  dateLastUpdated: Date;
  checkInDate: Date;
  checkOutDate: Date;
  otherCharges: string;
  totalAmount: string;
  status: string;
  guest: string;
  bookedByUser: Users;
  room: Room;
}
