import { Files } from "./files.model";
import { RoomType } from "./room-type.model";

export class Room {
  roomId: string;
  roomNumber: string;
  adultCapacity: string;
  childrenCapacity: string;
  roomRate: string;
  dateAdded: Date;
  dateLastUpdated: Date;
  status: string;
  active: boolean;
  roomType: RoomType;
  thumbnailFile: Files;
}
