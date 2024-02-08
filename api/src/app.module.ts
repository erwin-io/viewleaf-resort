import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./db/typeorm/typeorm.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import * as Joi from "@hapi/joi";
import { getEnvPath } from "./common/utils/utils";
import { UsersModule } from "./controller/users/users.module";
import { AccessModule } from "./controller/access/access.module";
import { FirebaseProviderModule } from "./core/provider/firebase/firebase-provider.module";
import { NotificationsModule } from "./controller/notifications/notifications.module";
import { RoomModule } from "./controller/room/room.module";
import { RoomBookingModule } from "./controller/room-booking/room-booking.module";
import { RoomTypeModule } from "./controller/room-type/room-type.module";
import { MailService } from "./services/mail.service";
import { MailModule } from "./controller/mail/mail.module";
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    AccessModule,
    NotificationsModule,
    FirebaseProviderModule,
    MailModule,
    RoomModule,
    RoomTypeModule,
    RoomBookingModule,
  ],
  providers: [AppService, MailService],
  controllers: [],
})
export class AppModule {}
