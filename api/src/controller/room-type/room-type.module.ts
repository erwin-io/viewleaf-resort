import { Module } from "@nestjs/common";
import { RoomTypeController } from "./room-type.controller";
import { RoomType } from "src/db/entities/RoomType";
import { RoomTypeService } from "src/services/room-type.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([RoomType])],
  controllers: [RoomTypeController],
  providers: [RoomTypeService],
  exports: [RoomTypeService],
})
export class RoomTypeModule {}
