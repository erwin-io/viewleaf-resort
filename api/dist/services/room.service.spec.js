"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const room_service_1 = require("./room.service");
describe("RoomService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [room_service_1.RoomService],
        }).compile();
        service = module.get(room_service_1.RoomService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=room.service.spec.js.map