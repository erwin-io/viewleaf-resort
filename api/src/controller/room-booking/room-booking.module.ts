import { Module } from "@nestjs/common";
import { RoomBookingController } from "./room-booking.controller";
import { RoomBookingService } from "src/services/room-booking.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomBooking } from "src/db/entities/RoomBooking";

@Module({
  imports: [TypeOrmModule.forFeature([RoomBooking])],
  controllers: [RoomBookingController],
  providers: [RoomBookingService],
  exports: [RoomBookingService],
})
export class RoomBookingModule {}
