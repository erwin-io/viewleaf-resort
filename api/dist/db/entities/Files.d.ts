import { Room } from "./Room";
import { RoomType } from "./RoomType";
import { UserProfilePic } from "./UserProfilePic";
export declare class Files {
    fileId: string;
    fileName: string;
    url: string | null;
    rooms: Room[];
    roomTypes: RoomType[];
    userProfilePics: UserProfilePic[];
}
