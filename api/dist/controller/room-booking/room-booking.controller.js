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
exports.RoomBookingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const room_booking_create_dto_1 = require("../../core/dto/room-booking/room-booking.create.dto");
const room_booking_update_dto_1 = require("../../core/dto/room-booking/room-booking.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const room_booking_service_1 = require("../../services/room-booking.service");
let RoomBookingController = class RoomBookingController {
    constructor(roomBookingService) {
        this.roomBookingService = roomBookingService;
    }
    async getDetails(roomBookingCode) {
        const res = {};
        try {
            res.data = await this.roomBookingService.getByCode(roomBookingCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = await this.roomBookingService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(roomBookingDto) {
        const res = {};
        try {
            res.data = await this.roomBookingService.create(roomBookingDto);
            res.success = true;
            res.message = `Room Booking ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateStatus(roomBookingCode, dto) {
        const res = {};
        try {
            res.data = await this.roomBookingService.updateStatus(roomBookingCode, dto);
            res.success = true;
            res.message = `Room Booking status ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
};
__decorate([
    (0, common_1.Get)("/:roomBookingCode"),
    __param(0, (0, common_1.Param)("roomBookingCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomBookingController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], RoomBookingController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [room_booking_create_dto_1.CreateRoomBookingDto]),
    __metadata("design:returntype", Promise)
], RoomBookingController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/updateStatus/:roomBookingCode"),
    __param(0, (0, common_1.Param)("roomBookingCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, room_booking_update_dto_1.UpdateRoomBookingStatusDto]),
    __metadata("design:returntype", Promise)
], RoomBookingController.prototype, "updateStatus", null);
RoomBookingController = __decorate([
    (0, swagger_1.ApiTags)("room-booking"),
    (0, common_1.Controller)("room-booking"),
    __metadata("design:paramtypes", [room_booking_service_1.RoomBookingService])
], RoomBookingController);
exports.RoomBookingController = RoomBookingController;
//# sourceMappingURL=room-booking.controller.js.map