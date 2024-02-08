import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { CreateRoomDto } from "src/core/dto/room/room.create.dto";
import { UpdateRoomDto } from "src/core/dto/room/room.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RoomService } from "src/services/room.service";
import { Room } from "src/db/entities/Room";

@ApiTags("rooms")
@Controller("rooms")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get("getByRoomNumber/:roomNumber")
  //   @UseGuards(JwtAuthGuard)
  async getByRoomNumber(@Param("roomNumber") roomNumber: string) {
    const res = {} as ApiResponseModel<Room>;
    try {
      res.data = await this.roomService.getByRoomNumber(roomNumber);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/:roomId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("roomId") roomId: string) {
    const res = {} as ApiResponseModel<Room>;
    try {
      res.data = await this.roomService.getById(roomId);
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
    const res: ApiResponseModel<{ results: Room[]; total: number }> = {} as any;
    try {
      res.data = await this.roomService.getPagination(params);
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
  async create(@Body() roomDto: CreateRoomDto) {
    const res: ApiResponseModel<Room> = {} as any;
    try {
      res.data = await this.roomService.create(roomDto);
      res.success = true;
      res.message = `Room ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:roomId")
  //   @UseGuards(JwtAuthGuard)
  async update(@Param("roomId") roomId: string, @Body() dto: UpdateRoomDto) {
    const res: ApiResponseModel<Room> = {} as any;
    try {
      res.data = await this.roomService.update(roomId, dto);
      res.success = true;
      res.message = `Room ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:roomId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("roomId") roomId: string) {
    const res: ApiResponseModel<Room> = {} as any;
    try {
      res.data = await this.roomService.delete(roomId);
      res.success = true;
      res.message = `Room ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
