import { Module } from "@nestjs/common";
import { RoomController } from "./room.controller";
import { Room } from "src/db/entities/Room";
import { RoomService } from "src/services/room.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
