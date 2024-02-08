"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const room_type_service_1 = require("./room-type.service");
describe('RoomTypeService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [room_type_service_1.RoomTypeService],
        }).compile();
        service = module.get(room_type_service_1.RoomTypeService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=room-type.service.spec.js.map