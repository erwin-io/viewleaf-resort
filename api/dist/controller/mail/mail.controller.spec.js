"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mail_controller_1 = require("./mail.controller");
describe("MailController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [mail_controller_1.MailController],
        }).compile();
        controller = module.get(mail_controller_1.MailController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=mail.controller.spec.js.map