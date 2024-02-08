import { CreateRoomDto } from "src/core/dto/room/room.create.dto";
import { UpdateRoomDto, UpdateRoomStatusDto } from "src/core/dto/room/room.update.dto";
import { Room } from "src/db/entities/Room";
import { Repository } from "typeorm";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
export declare class RoomService {
    private firebaseProvoder;
    private readonly roomRepo;
    constructor(firebaseProvoder: FirebaseProvider, roomRepo: Repository<Room>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Room[];
        total: number;
    }>;
    getById(roomId: any): Promise<Room>;
    getByRoomNumber(roomNumber?: string): Promise<Room>;
    create(dto: CreateRoomDto): Promise<Room>;
    update(roomId: any, dto: UpdateRoomDto): Promise<Room>;
    updateStatus(roomId: any, dto: UpdateRoomStatusDto): Promise<Room>;
    delete(roomId: any): Promise<Room>;
}
