import { GatewayConnectedUsers } from "./GatewayConnectedUsers";
import { Notifications } from "./Notifications";
import { RoomBooking } from "./RoomBooking";
import { UserProfilePic } from "./UserProfilePic";
import { Access } from "./Access";
export declare class Users {
    userId: string;
    userName: string;
    password: string;
    fullName: string;
    gender: string;
    birthDate: string;
    mobileNumber: string;
    accessGranted: boolean;
    active: boolean;
    userCode: string | null;
    address: string;
    userType: string;
    email: string;
    confirmationCode: string;
    confirmationComplete: boolean;
    gatewayConnectedUsers: GatewayConnectedUsers[];
    notifications: Notifications[];
    roomBookings: RoomBooking[];
    userProfilePic: UserProfilePic;
    access: Access;
}
