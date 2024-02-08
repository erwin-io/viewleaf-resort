import { CreateRoomBookingDto } from "src/core/dto/room-booking/room-booking.create.dto";
import { UpdateRoomBookingStatusDto } from "src/core/dto/room-booking/room-booking.update.dto";
import { RoomBooking } from "src/db/entities/RoomBooking";
import { Repository } from "typeorm";
export declare class RoomBookingService {
    private readonly roomBookingRepo;
    constructor(roomBookingRepo: Repository<RoomBooking>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: RoomBooking[];
        total: number;
    }>;
    getByCode(roomBookingCode?: string): Promise<RoomBooking>;
    create(dto: CreateRoomBookingDto): Promise<RoomBooking>;
    updateStatus(roomBookingCode: any, dto: UpdateRoomBookingStatusDto): Promise<RoomBooking>;
}
