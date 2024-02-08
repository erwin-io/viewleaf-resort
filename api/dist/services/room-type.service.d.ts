import { CreateRoomTypeDto } from "src/core/dto/room-type/room-type.create.dto";
import { UpdateRoomTypeDto } from "src/core/dto/room-type/room-type.update.dto";
import { RoomType } from "src/db/entities/RoomType";
import { Repository } from "typeorm";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
export declare class RoomTypeService {
    private firebaseProvoder;
    private readonly roomTypeRepo;
    constructor(firebaseProvoder: FirebaseProvider, roomTypeRepo: Repository<RoomType>);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: RoomType[];
        total: number;
    }>;
    getAll(): Promise<RoomType[]>;
    getByCode(roomTypeCode: any): Promise<RoomType>;
    create(dto: CreateRoomTypeDto): Promise<RoomType>;
    update(roomTypeCode: any, dto: UpdateRoomTypeDto): Promise<RoomType>;
    delete(roomTypeCode: any): Promise<RoomType>;
}
