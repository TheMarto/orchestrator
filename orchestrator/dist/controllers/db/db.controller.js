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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbController = void 0;
const common_1 = require("@nestjs/common");
const db_config_dto_1 = require("../../dto/db-config.dto");
const database_connection_service_1 = require("../../services/database-connection/database-connection.service");
let DbController = class DbController {
    db;
    constructor(db) {
        this.db = db;
    }
    async connect(payload) {
        const alias = payload.alias ?? 'default';
        await this.db.connect(alias, payload.config);
        return { success: true, alias, engine: payload.config.engine };
    }
    async health(alias = 'default') {
        const res = await this.db.health(alias);
        return { alias, ...res };
    }
    listAliases() {
        return { aliases: this.db.listAliases() };
    }
};
exports.DbController = DbController;
__decorate([
    (0, common_1.Post)('connect'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [db_config_dto_1.DbConnectPayloadDto]),
    __metadata("design:returntype", Promise)
], DbController.prototype, "connect", null);
__decorate([
    (0, common_1.Get)('health'),
    __param(0, (0, common_1.Query)('alias')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DbController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('aliases'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DbController.prototype, "listAliases", null);
exports.DbController = DbController = __decorate([
    (0, common_1.Controller)('db'),
    __metadata("design:paramtypes", [database_connection_service_1.DatabaseConnectionService])
], DbController);
//# sourceMappingURL=db.controller.js.map