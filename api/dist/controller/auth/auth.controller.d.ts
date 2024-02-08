import { AuthService } from "../../services/auth.service";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { LogInDto } from "src/core/dto/auth/login.dto";
import { RegisterGuestUserDto } from "src/core/dto/auth/register.dto";
import { Users } from "src/db/entities/Users";
import { UserConfirmationCodeDto } from "src/core/dto/auth/user-confirmation.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerGuest(createUserDto: RegisterGuestUserDto): Promise<ApiResponseModel<Users>>;
    confirmUser(dto: UserConfirmationCodeDto): Promise<ApiResponseModel<Users>>;
    loginStaff(loginUserDto: LogInDto): Promise<ApiResponseModel<Users>>;
    loginGuest(loginUserDto: LogInDto): Promise<ApiResponseModel<Users>>;
}
