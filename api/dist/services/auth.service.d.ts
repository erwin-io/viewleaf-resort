import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { Users } from "src/db/entities/Users";
import { RegisterGuestUserDto } from "src/core/dto/auth/register.dto";
import { MailService } from "./mail.service";
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly mailService;
    constructor(userRepo: Repository<Users>, jwtService: JwtService, mailService: MailService);
    registerGuest(dto: RegisterGuestUserDto): Promise<Users>;
    confirmUser({ confirmationCode }: {
        confirmationCode: any;
    }): Promise<Users>;
    getByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
    getStaffByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
    getGuestByCredentials({ userName, password }: {
        userName: any;
        password: any;
    }): Promise<Users>;
}
