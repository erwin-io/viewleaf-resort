import { Room } from "./Room";
import { Files } from "./Files";
export declare class RoomType {
    roomTypeId: string;
    roomTypeCode: string | null;
    name: string;
    active: boolean;
    dateAdded: Date;
    dateLastUpdated: Date | null;
    rooms: Room[];
    thumbnailFile: Files;
}
