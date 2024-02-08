import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { CreateRoomBookingDto } from "src/core/dto/room-booking/room-booking.create.dto";
import {
  UpdateRoomBookingDto,
  UpdateRoomBookingStatusDto,
} from "src/core/dto/room-booking/room-booking.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RoomBooking } from "src/db/entities/RoomBooking";
import { RoomBookingService } from "src/services/room-booking.service";

@ApiTags("room-booking")
@Controller("room-booking")
export class RoomBookingController {
  constructor(private readonly roomBookingService: RoomBookingService) {}

  @Get("/:roomBookingCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("roomBookingCode") roomBookingCode: string) {
    const res = {} as ApiResponseModel<RoomBooking>;
    try {
      res.data = await this.roomBookingService.getByCode(roomBookingCode);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{
      results: RoomBooking[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.roomBookingService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  //   @UseGuards(JwtAuthGuard)
  async create(@Body() roomBookingDto: CreateRoomBookingDto) {
    const res: ApiResponseModel<RoomBooking> = {} as any;
    try {
      res.data = await this.roomBookingService.create(roomBookingDto);
      res.success = true;
      res.message = `Room Booking ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateStatus/:roomBookingCode")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("roomBookingCode") roomBookingCode: string,
    @Body() dto: UpdateRoomBookingStatusDto
  ) {
    const res: ApiResponseModel<RoomBooking> = {} as any;
    try {
      res.data = await this.roomBookingService.updateStatus(
        roomBookingCode,
        dto
      );
      res.success = true;
      res.message = `Room Booking status ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
