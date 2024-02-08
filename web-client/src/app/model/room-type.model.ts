import { Files } from "./files.model";

export class RoomType {
  roomTypeId: string;
  roomTypeCode: string;
  name: string;
  active: boolean;
  dateAdded: Date;
  dateLastUpdated: Date;
  thumbnailFile: Files;
}
