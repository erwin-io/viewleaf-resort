/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { JwtPayload } from "../core/interfaces/payload.interface";
import { JwtService } from "@nestjs/jwt";
import * as fs from "fs";
import * as path from "path";
import {
  compare,
  generateIndentityCode,
  getFullName,
  hash,
} from "src/common/utils/utils";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, In, Repository } from "typeorm";
import moment from "moment";
import { Users } from "src/db/entities/Users";
import { LOGIN_ERROR_PASSWORD_INCORRECT, LOGIN_ERROR_PENDING_ACCESS_REQUEST, LOGIN_ERROR_USER_NOT_FOUND } from "src/common/constant/auth-error.constant";
import { RegisterGuestUserDto } from "src/core/dto/auth/register.dto";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import { v4 as uuid } from "uuid";
import { MailService } from "./mail.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async registerGuest(dto: RegisterGuestUserDto) {
    return await this.userRepo.manager.transaction(
      async (entityManager) => {
        try {
          let user = new Users();
          user.userName = dto.userName;
          user.password = await hash(dto.password);
          user.accessGranted = true;
          user.fullName = dto.fullName;
          user.mobileNumber = dto.mobileNumber;
          user.birthDate = moment(dto.birthDate.toString()).format("YYYY-MM-DD");
          user.gender = dto.gender;
          user.address = dto.address;
          user.email = dto.email;
          const confirmationCode: string = uuid();
          user.confirmationCode = confirmationCode;
          user.confirmationComplete = false;
          user.userType = USER_TYPE.GUEST.toUpperCase();
          user = await entityManager.save(user);
          user.userCode = generateIndentityCode(user.userId);
          user = await entityManager.save(Users, user);
          await this.mailService.sendUserEmailConfirmation({
            to: user.email,
            name: user.fullName,
            code: user.confirmationCode,
          })
          delete user.password;
          delete user.confirmationCode;
          return user;
        } catch (ex) {
          entityManager.queryRunner.rollbackTransaction();
          if (
            ex["message"] &&
            (ex["message"].includes("duplicate key") ||
              ex["message"].includes("violates unique constraint")) &&
            ex["message"].includes("u_user_number")
          ) {
            throw Error("Number already used!");
          } else if (
            ex["message"] &&
            (ex["message"].includes("duplicate key") ||
              ex["message"].includes("violates unique constraint")) &&
            ex["message"].includes("u_username")
          ) {
            throw Error("Username already used!");
          } else {
            throw ex;
          }
        }
      });
  }

  async confirmUser({confirmationCode}) {
    return await this.userRepo.manager.transaction(
      async (entityManager) => {
        try {
          let user = await entityManager.findOne(Users,{
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
          if(!user) {
            throw Error("Invalid confirmation!");
          }
          user.confirmationComplete = true;
          user = await entityManager.save(Users, user);
          user = await entityManager.findOne(Users, {
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
        } catch(ex) {
          throw ex;
        }
      });
  }
  
  async getByCredentials({userName, password }) {
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
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(user.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      if (!user.accessGranted) {
        throw Error(LOGIN_ERROR_PENDING_ACCESS_REQUEST);
      }
      if(user.userType === "GEUST" && !user.confirmationComplete) {
        throw Error("Please verify your account!");
      }
      delete user.password;
      delete user.confirmationCode;

      return user;
    } catch(ex) {
      throw ex;
    }
  }

  async getStaffByCredentials({userName, password }) {
    try {
      let user = await this.userRepo.findOne({
        where: {
          userName,
          active: true,
          userType: In([USER_TYPE.STAFF.toUpperCase()])
        },
        relations: {
          access: true,
          userProfilePic: {
            file: true,
          },
        }
      });
      if (!user) {
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(user.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      if (!user.accessGranted) {
        throw Error(LOGIN_ERROR_PENDING_ACCESS_REQUEST);
      }
      delete user.password;
      delete user.confirmationCode;
      return user;
    } catch(ex) {
      throw ex;
    }
  }
  
  async getGuestByCredentials({userName, password }) {
    try {
      let user = await this.userRepo.findOne({
        where: {
          userName,
          active: true,
          userType: USER_TYPE.GUEST.toUpperCase()
        },
        relations: {
          access: true,
          userProfilePic: {
            file: true,
          },
        }
      });
      if (!user) {
        throw Error(LOGIN_ERROR_USER_NOT_FOUND);
      }

      const passwordMatch = await compare(user.password, password);
      if (!passwordMatch) {
        throw Error(LOGIN_ERROR_PASSWORD_INCORRECT);
      }
      if (!user.accessGranted) {
        throw Error(LOGIN_ERROR_PENDING_ACCESS_REQUEST);
      }
      if(!user.confirmationComplete) {
        throw Error("Please verify your account!");
      }
      delete user.password;
      delete user.confirmationCode;

      return user;
    } catch(ex) {
      throw ex;
    }
  }
}
