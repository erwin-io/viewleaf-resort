"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const room_type_controller_1 = require("./room-type.controller");
describe("RoomTypeController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [room_type_controller_1.RoomTypeController],
        }).compile();
        controller = module.get(room_type_controller_1.RoomTypeController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=room-type.controller.spec.js.map