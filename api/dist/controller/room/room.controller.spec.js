"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const room_controller_1 = require("./room.controller");
describe("RoomController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [room_controller_1.RoomController],
        }).compile();
        controller = module.get(room_controller_1.RoomController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=room.controller.spec.js.map