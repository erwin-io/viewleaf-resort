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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomBookingStatusDto = exports.UpdateRoomBookingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const room_booking_base_dto_1 = require("./room-booking-base.dto");
class UpdateRoomBookingDto extends room_booking_base_dto_1.DefaultRoomBookingDto {
}
exports.UpdateRoomBookingDto = UpdateRoomBookingDto;
class UpdateRoomBookingStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["CONFIRMED", "CHECKED-IN", "CHECKED-OUT", "CANCELLED", "NO-SHOW"]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], UpdateRoomBookingStatusDto.prototype, "status", void 0);
exports.UpdateRoomBookingStatusDto = UpdateRoomBookingStatusDto;
//# sourceMappingURL=room-booking.update.dto.js.map