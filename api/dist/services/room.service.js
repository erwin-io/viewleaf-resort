"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const room_type_constant_1 = require("../common/constant/room-type.constant");
const room_constant_1 = require("../common/constant/room.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const utils_1 = require("../common/utils/utils");
const Room_1 = require("../db/entities/Room");
const typeorm_2 = require("typeorm");
const RoomType_1 = require("../db/entities/RoomType");
const uuid_1 = require("uuid");
const path_1 = require("path");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const Files_1 = require("../db/entities/Files");
let RoomService = class RoomService {
    constructor(firebaseProvoder, roomRepo) {
        this.firebaseProvoder = firebaseProvoder;
        this.roomRepo = roomRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.roomRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
                relations: {
                    roomType: {
                        thumbnailFile: true,
                    },
                    thumbnailFile: true,
                },
            }),
            this.roomRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getById(roomId) {
        const result = await this.roomRepo.findOne({
            where: {
                roomId,
                active: true,
            },
            relations: {
                roomType: {
                    thumbnailFile: true,
                },
                thumbnailFile: true,
            },
        });
        if (!result) {
            throw Error(room_constant_1.ROOM_ERROR_NOT_FOUND);
        }
        return result;
    }
    async getByRoomNumber(roomNumber = "") {
        var _a;
        const result = await this.roomRepo.findOne({
            where: {
                roomNumber: (_a = roomNumber === null || roomNumber === void 0 ? void 0 : roomNumber.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                active: true,
            },
            relations: {
                roomType: {
                    thumbnailFile: true,
                },
                thumbnailFile: true,
            },
        });
        if (!result) {
            throw Error(room_constant_1.ROOM_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        try {
            return await this.roomRepo.manager.transaction(async (entityManager) => {
                let room = new Room_1.Room();
                room.roomNumber = dto.roomNumber.toLowerCase();
                room.adultCapacity = dto.adultCapacity
                    ? dto.adultCapacity.toString()
                    : "0";
                room.childrenCapacity = dto.childrenCapacity
                    ? dto.childrenCapacity.toString()
                    : "0";
                room.roomRate = dto.roomRate ? dto.roomRate.toString() : "0";
                room.status = room_constant_1.ROOM_STATUS.AVAILABLE;
                const timestamp = await entityManager
                    .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                    .then((res) => {
                    return res[0]["timestamp"];
                });
                room.dateAdded = timestamp;
                const roomType = await entityManager.findOne(RoomType_1.RoomType, {
                    where: {
                        roomTypeId: dto.roomTypeId,
                    },
                });
                if (!roomType) {
                    throw Error(room_type_constant_1.ROOMTYPE_ERROR_NOT_FOUND);
                }
                room.roomType = roomType;
                if (dto.thumbnailFile) {
                    const newFileName = (0, uuid_1.v4)();
                    const bucket = this.firebaseProvoder.app.storage().bucket();
                    if (room.thumbnailFile) {
                        try {
                            const deleteFile = bucket.file(`room/${room.thumbnailFile.fileName}`);
                            deleteFile.delete();
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                        const file = room.thumbnailFile;
                        file.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                        const bucketFile = bucket.file(`room/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async (res) => {
                            console.log("res");
                            console.log(res);
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            file.url = url[0];
                            room.thumbnailFile = await entityManager.save(Files_1.Files, file);
                        });
                    }
                    else {
                        room.thumbnailFile = new Files_1.Files();
                        room.thumbnailFile.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                        const bucketFile = bucket.file(`room/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async () => {
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            room.thumbnailFile.url = url[0];
                            room.thumbnailFile = await entityManager.save(Files_1.Files, room.thumbnailFile);
                        });
                    }
                }
                room = await entityManager.save(room);
                return await entityManager.findOne(Room_1.Room, {
                    where: {
                        roomId: room.roomId,
                    },
                    relations: {
                        roomType: {
                            thumbnailFile: true,
                        },
                        thumbnailFile: true,
                    },
                });
            });
        }
        catch (ex) {
            if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_room")) {
                throw Error("Room name already exist!");
            }
            else if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_roomcode")) {
                throw Error("Room code already exist!");
            }
            else {
                throw ex;
            }
        }
    }
    async update(roomId, dto) {
        try {
            return await this.roomRepo.manager.transaction(async (entityManager) => {
                let room = await entityManager.findOne(Room_1.Room, {
                    where: {
                        roomId,
                        active: true,
                    },
                    relations: {
                        roomType: true,
                    },
                });
                if (!room) {
                    throw Error(room_constant_1.ROOM_ERROR_NOT_FOUND);
                }
                room.roomNumber = dto.roomNumber.toLowerCase();
                room.adultCapacity = dto.adultCapacity
                    ? dto.adultCapacity.toString()
                    : "0";
                room.childrenCapacity = dto.childrenCapacity
                    ? dto.childrenCapacity.toString()
                    : "0";
                room.roomRate = dto.roomRate ? dto.roomRate.toString() : "0";
                room.status = room_constant_1.ROOM_STATUS.AVAILABLE;
                const timestamp = await entityManager
                    .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                    .then((res) => {
                    return res[0]["timestamp"];
                });
                room.dateAdded = timestamp;
                const roomType = await entityManager.findOne(RoomType_1.RoomType, {
                    where: {
                        roomTypeId: dto.roomTypeId,
                    },
                });
                if (!roomType) {
                    throw Error(room_type_constant_1.ROOMTYPE_ERROR_NOT_FOUND);
                }
                room.roomType = roomType;
                if (dto.thumbnailFile) {
                    const newFileName = (0, uuid_1.v4)();
                    const bucket = this.firebaseProvoder.app.storage().bucket();
                    if (room.thumbnailFile) {
                        try {
                            const deleteFile = bucket.file(`room/${room.thumbnailFile.fileName}`);
                            deleteFile.delete();
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                        const file = room.thumbnailFile;
                        file.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                        const bucketFile = bucket.file(`room/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async (res) => {
                            console.log("res");
                            console.log(res);
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            file.url = url[0];
                            room.thumbnailFile = await entityManager.save(Files_1.Files, file);
                        });
                    }
                    else {
                        room.thumbnailFile = new Files_1.Files();
                        room.thumbnailFile.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                        const bucketFile = bucket.file(`room/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                        const img = Buffer.from(dto.thumbnailFile.data, "base64");
                        await bucketFile.save(img).then(async () => {
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            room.thumbnailFile.url = url[0];
                            room.thumbnailFile = await entityManager.save(Files_1.Files, room.thumbnailFile);
                        });
                    }
                }
                room = await entityManager.save(Room_1.Room, room);
                return await entityManager.findOne(Room_1.Room, {
                    where: {
                        roomId,
                        active: true,
                    },
                    relations: {
                        roomType: {
                            thumbnailFile: true,
                        },
                        thumbnailFile: true,
                    },
                });
            });
        }
        catch (ex) {
            if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_room")) {
                throw Error("Room name already exist!");
            }
            else if (ex["message"] &&
                (ex["message"].includes("duplicate key") ||
                    ex["message"].includes("violates unique constraint")) &&
                ex["message"].includes("u_roomcode")) {
                throw Error("Room code already exist!");
            }
            else {
                throw ex;
            }
        }
    }
    async updateStatus(roomId, dto) {
        return await this.roomRepo.manager.transaction(async (entityManager) => {
            let room = await entityManager.findOne(Room_1.Room, {
                where: {
                    roomId,
                    active: true,
                },
                relations: {
                    roomType: true,
                },
            });
            if (!room) {
                throw Error(room_constant_1.ROOM_ERROR_NOT_FOUND);
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            room.dateLastUpdated = timestamp;
            room.status = dto.status;
            room = await entityManager.save(Room_1.Room, room);
            return await entityManager.findOne(Room_1.Room, {
                where: {
                    roomId,
                    active: true,
                },
                relations: {
                    roomType: {
                        thumbnailFile: true,
                    },
                },
            });
        });
    }
    async delete(roomId) {
        return await this.roomRepo.manager.transaction(async (entityManager) => {
            const room = await entityManager.findOne(Room_1.Room, {
                where: {
                    roomId,
                    active: true,
                },
                relations: {
                    roomType: true,
                },
            });
            if (!room) {
                throw Error(room_constant_1.ROOM_ERROR_NOT_FOUND);
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            room.dateLastUpdated = timestamp;
            room.active = false;
            return await entityManager.save(Room_1.Room, room);
        });
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Room_1.Room)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map