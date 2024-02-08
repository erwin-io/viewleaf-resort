import { CreateRoomTypeDto } from "src/core/dto/room-type/room-type.create.dto";
import { UpdateRoomTypeDto } from "src/core/dto/room-type/room-type.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RoomType } from "src/db/entities/RoomType";
import { RoomTypeService } from "src/services/room-type.service";
export declare class RoomTypeController {
    private readonly roomTypesService;
    constructor(roomTypesService: RoomTypeService);
    getAll(): Promise<ApiResponseModel<RoomType[]>>;
    getDetails(roomTypesCode: string): Promise<ApiResponseModel<RoomType>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: RoomType[];
        total: number;
    }>>;
    create(roomTypesDto: CreateRoomTypeDto): Promise<ApiResponseModel<RoomType>>;
    update(roomTypesCode: string, dto: UpdateRoomTypeDto): Promise<ApiResponseModel<RoomType>>;
    delete(roomTypesCode: string): Promise<ApiResponseModel<RoomType>>;
}
