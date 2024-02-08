import { Module } from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { LocalStrategy } from "../../core/auth/local.strategy";
import { JwtStrategy } from "../../core/auth/jwt.strategy";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/db/entities/Users";
import { MailService } from "src/services/mail.service";

@Module({
  imports: [
    UsersModule,
    PassportModule.register({}),
    JwtModule.register({}),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, MailService],
  exports: [AuthService, MailService],
})
export class AuthModule {}
