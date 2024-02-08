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
exports.RoomBooking = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const Room_1 = require("./Room");
let RoomBooking = class RoomBooking {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "RoomBookingId" }),
    __metadata("design:type", String)
], RoomBooking.prototype, "roomBookingId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RoomBookingCode", nullable: true }),
    __metadata("design:type", String)
], RoomBooking.prototype, "roomBookingCode", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateCreated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], RoomBooking.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], RoomBooking.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "CheckInDate",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], RoomBooking.prototype, "checkInDate", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "CheckOutDate",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], RoomBooking.prototype, "checkOutDate", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "RoomRateAmount", default: () => "0" }),
    __metadata("design:type", String)
], RoomBooking.prototype, "roomRateAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "OtherCharges", default: () => "0" }),
    __metadata("design:type", String)
], RoomBooking.prototype, "otherCharges", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalAmount", default: () => "0" }),
    __metadata("design:type", String)
], RoomBooking.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'PENDING'" }),
    __metadata("design:type", String)
], RoomBooking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Guest", default: () => "'WALK-IN'" }),
    __metadata("design:type", String)
], RoomBooking.prototype, "guest", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.roomBookings),
    (0, typeorm_1.JoinColumn)([{ name: "BookedByUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], RoomBooking.prototype, "bookedByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Room_1.Room, (room) => room.roomBookings),
    (0, typeorm_1.JoinColumn)([{ name: "RoomId", referencedColumnName: "roomId" }]),
    __metadata("design:type", Room_1.Room)
], RoomBooking.prototype, "room", void 0);
RoomBooking = __decorate([
    (0, typeorm_1.Index)("RoomBooking_pkey", ["roomBookingId"], { unique: true }),
    (0, typeorm_1.Entity)("RoomBooking", { schema: "dbo" })
], RoomBooking);
exports.RoomBooking = RoomBooking;
//# sourceMappingURL=RoomBooking.js.map