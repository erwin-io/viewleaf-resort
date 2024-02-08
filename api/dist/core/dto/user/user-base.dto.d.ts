export declare class UserDto {
    userId: string;
}
export declare class DefaultUserDto {
    fullName: string;
    mobileNumber: string;
    birthDate: Date;
    gender: "MALE" | "FEMALE" | "OTHERS";
    address: string;
    email: string;
}
export declare class UpdateProfilePictureDto {
    userProfilePic: any;
}
