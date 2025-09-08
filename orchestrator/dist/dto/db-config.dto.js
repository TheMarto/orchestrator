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
exports.DbConnectPayloadDto = exports.DbConfigDto = exports.SUPPORTED_ENGINES = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
exports.SUPPORTED_ENGINES = ['mysql', 'postgres', 'sqlite', 'mongo'];
class DbConfigDto {
    engine;
    host;
    port;
    database;
    user;
    password;
    ssl;
    file;
    uri;
    options;
}
exports.DbConfigDto = DbConfigDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.SUPPORTED_ENGINES),
    __metadata("design:type", String)
], DbConfigDto.prototype, "engine", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.engine === 'mysql' || o.engine === 'postgres'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DbConfigDto.prototype, "host", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.engine === 'mysql' || o.engine === 'postgres'),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DbConfigDto.prototype, "port", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.engine === 'mysql' || o.engine === 'postgres'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DbConfigDto.prototype, "database", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.engine === 'mysql' || o.engine === 'postgres'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DbConfigDto.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.engine === 'mysql' || o.engine === 'postgres'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DbConfigDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.engine === 'mysql' || o.engine === 'postgres'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DbConfigDto.prototype, "ssl", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.engine === 'sqlite'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DbConfigDto.prototype, "file", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.engine === 'mongo'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DbConfigDto.prototype, "uri", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.engine === 'mongo'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DbConfigDto.prototype, "options", void 0);
class DbConnectPayloadDto {
    alias = 'default';
    config;
}
exports.DbConnectPayloadDto = DbConnectPayloadDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DbConnectPayloadDto.prototype, "alias", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DbConfigDto),
    __metadata("design:type", DbConfigDto)
], DbConnectPayloadDto.prototype, "config", void 0);
//# sourceMappingURL=db-config.dto.js.map