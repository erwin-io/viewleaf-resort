"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const room_booking_controller_1 = require("./room-booking.controller");
describe("RoomBookingController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [room_booking_controller_1.RoomBookingController],
        }).compile();
        controller = module.get(room_booking_controller_1.RoomBookingController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=room-booking.controller.spec.js.map