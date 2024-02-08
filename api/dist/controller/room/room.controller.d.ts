import { CreateRoomDto } from "src/core/dto/room/room.create.dto";
import { UpdateRoomDto } from "src/core/dto/room/room.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RoomService } from "src/services/room.service";
import { Room } from "src/db/entities/Room";
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    getByRoomNumber(roomNumber: string): Promise<ApiResponseModel<Room>>;
    getDetails(roomId: string): Promise<ApiResponseModel<Room>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Room[];
        total: number;
    }>>;
    create(roomDto: CreateRoomDto): Promise<ApiResponseModel<Room>>;
    update(roomId: string, dto: UpdateRoomDto): Promise<ApiResponseModel<Room>>;
    delete(roomId: string): Promise<ApiResponseModel<Room>>;
}
