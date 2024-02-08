import { DefaultMailDto } from "./mail-base.dto";
export declare class UserConfirmationMailDto extends DefaultMailDto {
    name: string;
    code: string;
}
