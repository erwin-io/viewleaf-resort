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
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MailService = class MailService {
    constructor(mailerService, config) {
        this.mailerService = mailerService;
        this.config = config;
    }
    async create(dto) {
        const context = {
            name: dto.name,
            appUrl: this.config.get("APP_URL"),
            appName: this.config.get("MAIL_APP_NAME"),
            banner: this.config.get("MAIL_BANNER"),
        };
        return await this.mailerService.sendMail({
            to: dto.to,
            subject: "Welcome to Nice App! Confirm your Email",
            template: "./transactional",
            context,
        });
    }
    async sendUserEmailConfirmation(dto) {
        const context = {
            name: dto.name,
            url: `${this.config.get("APP_URL")}/auth/confirm/${dto.code}`,
            appUrl: this.config.get("APP_URL"),
            appName: this.config.get("MAIL_APP_NAME"),
            banner: this.config.get("MAIL_BANNER"),
        };
        return await this.mailerService.sendMail({
            to: dto.to,
            subject: `${this.config.get("AUTH_CONFIRMATION_SUBJECT")}`,
            template: `${this.config.get("AUTH_CONFIRMATION_TEMPLATE")}`,
            context,
        });
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map