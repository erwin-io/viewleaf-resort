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
exports.RoomType = void 0;
const typeorm_1 = require("typeorm");
const Room_1 = require("./Room");
const Files_1 = require("./Files");
let RoomType = class RoomType {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "RoomTypeId" }),
    __metadata("design:type", String)
], RoomType.prototype, "roomTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RoomTypeCode", nullable: true }),
    __metadata("design:type", String)
], RoomType.prototype, "roomTypeCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], RoomType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], RoomType.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateAdded",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], RoomType.prototype, "dateAdded", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], RoomType.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Room_1.Room, (room) => room.roomType),
    __metadata("design:type", Array)
], RoomType.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Files_1.Files, (files) => files.roomTypes),
    (0, typeorm_1.JoinColumn)([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", Files_1.Files)
], RoomType.prototype, "thumbnailFile", void 0);
RoomType = __decorate([
    (0, typeorm_1.Index)("RoomType_pkey", ["roomTypeId"], { unique: true }),
    (0, typeorm_1.Entity)("RoomType", { schema: "dbo" })
], RoomType);
exports.RoomType = RoomType;
//# sourceMappingURL=RoomType.js.map