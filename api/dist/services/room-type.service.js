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
exports.RoomTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const room_type_constant_1 = require("../common/constant/room-type.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const utils_1 = require("../common/utils/utils");
const Files_1 = require("../db/entities/Files");
const RoomType_1 = require("../db/entities/RoomType");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const path_1 = require("path");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
let RoomTypeService = class RoomTypeService {
    constructor(firebaseProvoder, roomTypeRepo) {
        this.firebaseProvoder = firebaseProvoder;
        this.roomTypeRepo = roomTypeRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.roomTypeRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                relations: {
                    thumbnailFile: true,
                },
                skip,
                take,
                order,
            }),
            this.roomTypeRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getAll() {
        return this.roomTypeRepo.find({
            where: {
                active: true,
            },
            relations: {
                thumbnailFile: true,
            },
        });
    }
    async getByCode(roomTypeCode) {
        const result = await this.roomTypeRepo.findOne({
            where: {
                roomTypeCode,
                active: true,
            },
            relations: {
                thumbnailFile: true,
            },
        });
        if (!result) {
            throw Error(room_type_constant_1.ROOMTYPE_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.roomTypeRepo.manager.transaction(async (entityManager) => {
            let roomType = new RoomType_1.RoomType();
            roomType.name = dto.name;
            roomType = await entityManager.save(roomType);
            roomType.roomTypeCode = (0, utils_1.generateIndentityCode)(roomType.roomTypeId);
            if (dto.thumbnailFile) {
                const bucket = this.firebaseProvoder.app.storage().bucket();
                roomType.thumbnailFile = new Files_1.Files();
                const newFileName = (0, uuid_1.v4)();
                roomType.thumbnailFile.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                const bucketFile = bucket.file(`room-type/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                const img = Buffer.from(dto.thumbnailFile.data, "base64");
                await bucketFile.save(img).then(async () => {
                    const url = await bucketFile.getSignedUrl({
                        action: "read",
                        expires: "03-09-2500",
                    });
                    roomType.thumbnailFile.url = url[0];
                    roomType.thumbnailFile = await entityManager.save(Files_1.Files, roomType.thumbnailFile);
                });
            }
            roomType = await entityManager.save(RoomType_1.RoomType, roomType);
            roomType = await entityManager.findOne(RoomType_1.RoomType, {
                where: {
                    roomTypeId: roomType.roomTypeId,
                },
                relations: {
                    thumbnailFile: true,
                },
            });
            return roomType;
        });
    }
    async update(roomTypeCode, dto) {
        return await this.roomTypeRepo.manager.transaction(async (entityManager) => {
            let roomType = await entityManager.findOne(RoomType_1.RoomType, {
                where: {
                    roomTypeCode,
                    active: true,
                },
                relations: {
                    thumbnailFile: true,
                },
            });
            if (!roomType) {
                throw Error(room_type_constant_1.ROOMTYPE_ERROR_NOT_FOUND);
            }
            roomType.name = dto.name;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            roomType.dateAdded = timestamp;
            if (dto.thumbnailFile) {
                const newFileName = (0, uuid_1.v4)();
                const bucket = this.firebaseProvoder.app.storage().bucket();
                if (roomType.thumbnailFile) {
                    try {
                        const deleteFile = bucket.file(`room-type/${roomType.thumbnailFile.fileName}`);
                        deleteFile.delete();
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                    const file = roomType.thumbnailFile;
                    file.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                    const bucketFile = bucket.file(`room-type/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                    const img = Buffer.from(dto.thumbnailFile.data, "base64");
                    await bucketFile.save(img).then(async (res) => {
                        console.log("res");
                        console.log(res);
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        file.url = url[0];
                        roomType.thumbnailFile = await entityManager.save(Files_1.Files, file);
                    });
                }
                else {
                    roomType.thumbnailFile = new Files_1.Files();
                    roomType.thumbnailFile.fileName = `${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`;
                    const bucketFile = bucket.file(`room-type/${newFileName}${(0, path_1.extname)(dto.thumbnailFile.fileName)}`);
                    const img = Buffer.from(dto.thumbnailFile.data, "base64");
                    await bucketFile.save(img).then(async () => {
                        const url = await bucketFile.getSignedUrl({
                            action: "read",
                            expires: "03-09-2500",
                        });
                        roomType.thumbnailFile.url = url[0];
                        roomType.thumbnailFile = await entityManager.save(Files_1.Files, roomType.thumbnailFile);
                    });
                }
            }
            roomType = await entityManager.save(RoomType_1.RoomType, roomType);
            roomType = await entityManager.findOne(RoomType_1.RoomType, {
                where: {
                    roomTypeId: roomType.roomTypeId,
                },
                relations: {
                    thumbnailFile: true,
                },
            });
            return roomType;
        });
    }
    async delete(roomTypeCode) {
        return await this.roomTypeRepo.manager.transaction(async (entityManager) => {
            const roomType = await entityManager.findOne(RoomType_1.RoomType, {
                where: {
                    roomTypeCode,
                    active: true,
                },
            });
            if (!roomType) {
                throw Error(room_type_constant_1.ROOMTYPE_ERROR_NOT_FOUND);
            }
            roomType.active = false;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            roomType.dateLastUpdated = timestamp;
            return await entityManager.save(RoomType_1.RoomType, roomType);
        });
    }
};
RoomTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(RoomType_1.RoomType)),
    __metadata("design:paramtypes", [firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], RoomTypeService);
exports.RoomTypeService = RoomTypeService;
//# sourceMappingURL=room-type.service.js.map