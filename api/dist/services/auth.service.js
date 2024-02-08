"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("../common/utils/utils");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const moment_1 = __importDefault(require("moment"));
const Users_1 = require("../db/entities/Users");
const auth_error_constant_1 = require("../common/constant/auth-error.constant");
const user_type_constant_1 = require("../common/constant/user-type.constant");
const uuid_1 = require("uuid");
const mail_service_1 = require("./mail.service");
let AuthService = class AuthService {
    constructor(userRepo, jwtService, mailService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async registerGuest(dto) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            try {
                let user = new Users_1.Users();
                user.userName = dto.userName;
                user.password = await (0, utils_1.hash)(dto.password);
                user.accessGranted = true;
                user.fullName = dto.fullName;
                user.mobileNumber = dto.mobileNumber;
                user.birthDate = (0, moment_1.default)(dto.birthDate.toString()).format("YYYY-MM-DD");
                user.gender = dto.gender;
                user.address = dto.address;
                user.email = dto.email;
                const confirmationCode = (0, uuid_1.v4)();
                user.confirmationCode = confirmationCode;
                user.confirmationComplete = false;
                user.userType = user_type_constant_1.USER_TYPE.GUEST.toUpperCase();
                user = await entityManager.save(user);
                user.userCode = (0, utils_1.generateIndentityCode)(user.userId);
                user = await entityManager.save(Users_1.Users, user);
                await this.mailService.sendUserEmailConfirmation({
                    to: user.email,
                    name: user.fullName,
                    code: user.confirmationCode,
                });
                delete user.password;
                delete user.confirmationCode;
                return user;
            }
            catch (ex) {
                entityManager.queryRunner.rollbackTransaction();
                if (ex["message"] &&
                    (ex["message"].includes("duplicate key") ||
                        ex["message"].includes("violates unique constraint")) &&
                    ex["message"].includes("u_user_number")) {
                    throw Error("Number already used!");
                }
                else if (ex["message"] &&
                    (ex["message"].includes("duplicate key") ||
                        ex["message"].includes("violates unique constraint")) &&
                    ex["message"].includes("u_username")) {
                    throw Error("Username already used!");
                }
                else {
                    throw ex;
                }
            }
        });
    }
    async confirmUser({ confirmationCode }) {
        return await this.userRepo.manager.transaction(async (entityManager) => {
            try {
                let user = await entityManager.findOne(Users_1.Users, {
                    where: {
                        confirmationCode,
                        confirmationComplete: false,
                    },
                    relations: {
                        access: true,
                        userProfilePic: {
                            file: true,
                        },
                    }
                });
                if (!user) {
                    throw Error("Invalid confirmation!");
                }
                user.confirmationComplete = true;
                user = await entityManager.save(Users_1.Users, user);
                user = await entityManager.findOne(Users_1.Users, {
                    where: {
                        userId: user.userId,
                    },
                    relations: {
                        access: true,
                        userProfilePic: {
                            file: true,
                        },
                    }
                });
                delete user.password;
                delete user.confirmationCode;
                return user;
            }
            catch (ex) {
                throw ex;
            }
        });
    }
    async getByCredentials({ userName, password }) {
        try {
            let user = await this.userRepo.findOne({
                where: {
                    userName,
                    active: true,
                },
                relations: {
                    access: true,
                    userProfilePic: {
                        file: true,
                    },
                }
            });
            if (!user) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
            }
            const passwordMatch = await (0, utils_1.compare)(user.password, password);
            if (!passwordMatch) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PASSWORD_INCORRECT);
            }
            if (!user.accessGranted) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PENDING_ACCESS_REQUEST);
            }
            if (user.userType === "GEUST" && !user.confirmationComplete) {
                throw Error("Please verify your account!");
            }
            delete user.password;
            delete user.confirmationCode;
            return user;
        }
        catch (ex) {
            throw ex;
        }
    }
    async getStaffByCredentials({ userName, password }) {
        try {
            let user = await this.userRepo.findOne({
                where: {
                    userName,
                    active: true,
                    userType: (0, typeorm_2.In)([user_type_constant_1.USER_TYPE.STAFF.toUpperCase()])
                },
                relations: {
                    access: true,
                    userProfilePic: {
                        file: true,
                    },
                }
            });
            if (!user) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
            }
            const passwordMatch = await (0, utils_1.compare)(user.password, password);
            if (!passwordMatch) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PASSWORD_INCORRECT);
            }
            if (!user.accessGranted) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PENDING_ACCESS_REQUEST);
            }
            delete user.password;
            delete user.confirmationCode;
            return user;
        }
        catch (ex) {
            throw ex;
        }
    }
    async getGuestByCredentials({ userName, password }) {
        try {
            let user = await this.userRepo.findOne({
                where: {
                    userName,
                    active: true,
                    userType: user_type_constant_1.USER_TYPE.GUEST.toUpperCase()
                },
                relations: {
                    access: true,
                    userProfilePic: {
                        file: true,
                    },
                }
            });
            if (!user) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_USER_NOT_FOUND);
            }
            const passwordMatch = await (0, utils_1.compare)(user.password, password);
            if (!passwordMatch) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PASSWORD_INCORRECT);
            }
            if (!user.accessGranted) {
                throw Error(auth_error_constant_1.LOGIN_ERROR_PENDING_ACCESS_REQUEST);
            }
            if (!user.confirmationComplete) {
                throw Error("Please verify your account!");
            }
            delete user.password;
            delete user.confirmationCode;
            return user;
        }
        catch (ex) {
            throw ex;
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map