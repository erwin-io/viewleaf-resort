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
exports.RoomTypeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const room_type_create_dto_1 = require("../../core/dto/room-type/room-type.create.dto");
const room_type_update_dto_1 = require("../../core/dto/room-type/room-type.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const room_type_service_1 = require("../../services/room-type.service");
let RoomTypeController = class RoomTypeController {
    constructor(roomTypesService) {
        this.roomTypesService = roomTypesService;
    }
    async getAll() {
        const res = {};
        try {
            res.data = await this.roomTypesService.getAll();
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getDetails(roomTypesCode) {
        const res = {};
        try {
            res.data = await this.roomTypesService.getByCode(roomTypesCode);
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
            res.data = await this.roomTypesService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(roomTypesDto) {
        const res = {};
        try {
            res.data = await this.roomTypesService.create(roomTypesDto);
            res.success = true;
            res.message = `Room Type ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(roomTypesCode, dto) {
        const res = {};
        try {
            res.data = await this.roomTypesService.update(roomTypesCode, dto);
            res.success = true;
            res.message = `Room Type ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(roomTypesCode) {
        const res = {};
        try {
            res.data = await this.roomTypesService.delete(roomTypesCode);
            res.success = true;
            res.message = `Room Type ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/getAll"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("/:roomTypesCode"),
    __param(0, (0, common_1.Param)("roomTypesCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [room_type_create_dto_1.CreateRoomTypeDto]),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:roomTypesCode"),
    __param(0, (0, common_1.Param)("roomTypesCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, room_type_update_dto_1.UpdateRoomTypeDto]),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:roomTypesCode"),
    __param(0, (0, common_1.Param)("roomTypesCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "delete", null);
RoomTypeController = __decorate([
    (0, swagger_1.ApiTags)("room-type"),
    (0, common_1.Controller)("room-type"),
    __metadata("design:paramtypes", [room_type_service_1.RoomTypeService])
], RoomTypeController);
exports.RoomTypeController = RoomTypeController;
//# sourceMappingURL=room-type.controller.js.map