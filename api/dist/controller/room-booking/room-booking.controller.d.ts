import { CreateRoomBookingDto } from "src/core/dto/room-booking/room-booking.create.dto";
import { UpdateRoomBookingStatusDto } from "src/core/dto/room-booking/room-booking.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { RoomBooking } from "src/db/entities/RoomBooking";
import { RoomBookingService } from "src/services/room-booking.service";
export declare class RoomBookingController {
    private readonly roomBookingService;
    constructor(roomBookingService: RoomBookingService);
    getDetails(roomBookingCode: string): Promise<ApiResponseModel<RoomBooking>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: RoomBooking[];
        total: number;
    }>>;
    create(roomBookingDto: CreateRoomBookingDto): Promise<ApiResponseModel<RoomBooking>>;
    updateStatus(roomBookingCode: string, dto: UpdateRoomBookingStatusDto): Promise<ApiResponseModel<RoomBooking>>;
}
