"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const room_booking_service_1 = require("./room-booking.service");
describe("RoomBookingService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [room_booking_service_1.RoomBookingService],
        }).compile();
        service = module.get(room_booking_service_1.RoomBookingService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=room-booking.service.spec.js.map