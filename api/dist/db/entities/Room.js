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
exports.Room = void 0;
const typeorm_1 = require("typeorm");
const RoomType_1 = require("./RoomType");
const Files_1 = require("./Files");
const RoomBooking_1 = require("./RoomBooking");
let Room = class Room {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "RoomId" }),
    __metadata("design:type", String)
], Room.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RoomNumber" }),
    __metadata("design:type", String)
], Room.prototype, "roomNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "AdultCapacity", default: () => "0" }),
    __metadata("design:type", String)
], Room.prototype, "adultCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "ChildrenCapacity", default: () => "0" }),
    __metadata("design:type", String)
], Room.prototype, "childrenCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "RoomRate", default: () => "0" }),
    __metadata("design:type", String)
], Room.prototype, "roomRate", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateAdded",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], Room.prototype, "dateAdded", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Room.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'AVAILABLE'" }),
    __metadata("design:type", String)
], Room.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Room.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RoomType_1.RoomType, (roomType) => roomType.rooms),
    (0, typeorm_1.JoinColumn)([{ name: "RoomTypeId", referencedColumnName: "roomTypeId" }]),
    __metadata("design:type", RoomType_1.RoomType)
], Room.prototype, "roomType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Files_1.Files, (files) => files.rooms),
    (0, typeorm_1.JoinColumn)([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", Files_1.Files)
], Room.prototype, "thumbnailFile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RoomBooking_1.RoomBooking, (roomBooking) => roomBooking.room),
    __metadata("design:type", Array)
], Room.prototype, "roomBookings", void 0);
Room = __decorate([
    (0, typeorm_1.Index)("u_room_number", ["active", "roomNumber"], { unique: true }),
    (0, typeorm_1.Index)("Room_pkey", ["roomId"], { unique: true }),
    (0, typeorm_1.Entity)("Room", { schema: "dbo" })
], Room);
exports.Room = Room;
//# sourceMappingURL=Room.js.map