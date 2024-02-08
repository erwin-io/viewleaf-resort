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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomBookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment_1 = __importDefault(require("moment"));
const date_constant_1 = require("../common/constant/date.constant");
const room_constant_1 = require("../common/constant/room.constant");
const room_booking_constant_1 = require("../common/constant/room-booking.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const utils_1 = require("../common/utils/utils");
const Room_1 = require("../db/entities/Room");
const RoomBooking_1 = require("../db/entities/RoomBooking");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
let RoomBookingService = class RoomBookingService {
    constructor(roomBookingRepo) {
        this.roomBookingRepo = roomBookingRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.roomBookingRepo.find({
                where: Object.assign({}, condition),
                skip,
                take,
                order,
                relations: {
                    room: {
                        roomType: {
                            thumbnailFile: true,
                        },
                    },
                    bookedByUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            }),
            this.roomBookingRepo.count({
                where: Object.assign({}, condition),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByCode(roomBookingCode = "") {
        var _a;
        const result = await this.roomBookingRepo.findOne({
            where: {
                roomBookingCode: (_a = roomBookingCode === null || roomBookingCode === void 0 ? void 0 : roomBookingCode.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
            },
            relations: {
                room: {
                    roomType: true,
                },
                bookedByUser: {
                    userProfilePic: {
                        file: true,
                    },
                },
            },
        });
        if (!result) {
            throw Error(room_booking_constant_1.ROOMBOOKING_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.roomBookingRepo.manager.transaction(async (entityManager) => {
            let roomBooking = await entityManager.findOne(RoomBooking_1.RoomBooking, {
                where: {
                    room: {
                        roomNumber: dto.roomNumber,
                    },
                    bookedByUser: {
                        userCode: dto.bookedByUserCode,
                    },
                    status: (0, typeorm_2.In)(["PENDING", "CONFIRMED", "CHECKED-IN", "CHECKED-IN"]),
                },
            });
            if (roomBooking) {
                throw Error("The user has a " +
                    roomBooking.status.toLocaleLowerCase() +
                    " booking for the selected room.");
            }
            else {
                roomBooking = new RoomBooking_1.RoomBooking();
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            roomBooking.dateCreated = timestamp;
            const checkInDate = await entityManager
                .query((0, timestamp_constant_1.getDateWithTimeZone)((0, moment_1.default)(dto.checkInDate).format("YYYY-MM-DD"), date_constant_1.DateConstant.DATE_LANGUAGE))
                .then((res) => {
                return res[0]["timeZone"];
            });
            roomBooking.checkInDate = checkInDate;
            const checkOutDate = await entityManager
                .query((0, timestamp_constant_1.getDateWithTimeZone)((0, moment_1.default)(dto.checkOutDate).format("YYYY-MM-DD"), "Asia/Manila"))
                .then((res) => {
                return res[0]["timeZone"];
            });
            roomBooking.checkOutDate = checkOutDate;
            const guest = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode: dto.bookedByUserCode,
                },
            });
            if (!guest) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            roomBooking.bookedByUser = guest;
            roomBooking.guest = guest.fullName;
            const room = await entityManager.findOne(Room_1.Room, {
                where: {
                    roomNumber: dto.roomNumber,
                    status: room_constant_1.ROOM_STATUS.AVAILABLE,
                },
            });
            if (!room) {
                throw Error(room_constant_1.ROOM_ERROR_NOT_FOUND);
            }
            roomBooking.room = room;
            roomBooking.status = room_booking_constant_1.ROOMBOOKING_STATUS.PENDING;
            roomBooking = await entityManager.save(roomBooking);
            roomBooking.roomBookingCode = (0, utils_1.generateIndentityCode)(roomBooking.roomBookingId);
            roomBooking = await entityManager.save(roomBooking);
            return await entityManager.findOne(RoomBooking_1.RoomBooking, {
                where: {
                    roomBookingCode: roomBooking.roomBookingCode,
                },
                relations: {
                    room: {
                        roomType: true,
                    },
                },
            });
        });
    }
    async updateStatus(roomBookingCode, dto) {
        return await this.roomBookingRepo.manager.transaction(async (entityManager) => {
            const { status } = dto;
            const roomBooking = await entityManager.findOne(RoomBooking_1.RoomBooking, {
                where: {
                    roomBookingCode,
                },
                relations: {
                    room: {
                        roomType: true,
                    },
                    bookedByUser: true,
                },
            });
            if (!roomBooking) {
                throw Error(room_booking_constant_1.ROOMBOOKING_ERROR_NOT_FOUND);
            }
            if ([
                room_booking_constant_1.ROOMBOOKING_STATUS.CHECKEDIN,
                room_booking_constant_1.ROOMBOOKING_STATUS.CHECKEDOUT,
                room_booking_constant_1.ROOMBOOKING_STATUS.CANCELLED,
                room_booking_constant_1.ROOMBOOKING_STATUS.NOSHOW,
            ].some((x) => x.toLocaleLowerCase() === roomBooking.status.toLocaleLowerCase()) &&
                (status === room_booking_constant_1.ROOMBOOKING_STATUS.CANCELLED ||
                    status === room_booking_constant_1.ROOMBOOKING_STATUS.NOSHOW)) {
                throw Error("The booking was already " + roomBooking.status.toLowerCase());
            }
            if (roomBooking.status !== room_booking_constant_1.ROOMBOOKING_STATUS.PENDING &&
                status === room_booking_constant_1.ROOMBOOKING_STATUS.CONFIRMED) {
                throw Error("The booking was already " + roomBooking.status.toLowerCase());
            }
            if (roomBooking.status !== room_booking_constant_1.ROOMBOOKING_STATUS.CONFIRMED &&
                status === room_booking_constant_1.ROOMBOOKING_STATUS.CHECKEDIN) {
                throw Error("The booking was already " + roomBooking.status.toLowerCase());
            }
            if (roomBooking.status !== room_booking_constant_1.ROOMBOOKING_STATUS.CHECKEDIN &&
                status === room_booking_constant_1.ROOMBOOKING_STATUS.CHECKEDOUT) {
                throw Error("The booking was already " + roomBooking.status.toLowerCase());
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            roomBooking.dateLastUpdated = timestamp;
            roomBooking.status = dto.status;
            return await entityManager.save(RoomBooking_1.RoomBooking, roomBooking);
        });
    }
};
RoomBookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(RoomBooking_1.RoomBooking)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomBookingService);
exports.RoomBookingService = RoomBookingService;
//# sourceMappingURL=room-booking.service.js.map