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
import { CreateRoomTypeDto } from "src/core/dto/room-type/room-type.create.dto";
import { UpdateRoomTypeDto } from "src/core/dto/room-type/room-type.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RoomType } from "src/db/entities/RoomType";
import { RoomTypeService } from "src/services/room-type.service";

@ApiTags("room-type")
@Controller("room-type")
export class RoomTypeController {
  constructor(private readonly roomTypesService: RoomTypeService) {}

  @Get("/getAll")
  //   @UseGuards(JwtAuthGuard)
  async getAll() {
    const res: ApiResponseModel<RoomType[]> = {} as any;
    try {
      res.data = await this.roomTypesService.getAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/:roomTypesCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("roomTypesCode") roomTypesCode: string) {
    const res = {} as ApiResponseModel<RoomType>;
    try {
      res.data = await this.roomTypesService.getByCode(roomTypesCode);
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
      results: RoomType[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.roomTypesService.getPagination(params);
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
  async create(@Body() roomTypesDto: CreateRoomTypeDto) {
    const res: ApiResponseModel<RoomType> = {} as any;
    try {
      res.data = await this.roomTypesService.create(roomTypesDto);
      res.success = true;
      res.message = `Stall Classifications ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:roomTypesCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("roomTypesCode") roomTypesCode: string,
    @Body() dto: UpdateRoomTypeDto
  ) {
    const res: ApiResponseModel<RoomType> = {} as any;
    try {
      res.data = await this.roomTypesService.update(roomTypesCode, dto);
      res.success = true;
      res.message = `Stall Classifications ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:roomTypesCode")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("roomTypesCode") roomTypesCode: string) {
    const res: ApiResponseModel<RoomType> = {} as any;
    try {
      res.data = await this.roomTypesService.delete(roomTypesCode);
      res.success = true;
      res.message = `Stall Classifications ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
