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
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mysql_connector_1 = require("../connectors/mysql.connector");
const database_connection_service_1 = require("../services/database-connection/database-connection.service");
let DatabaseModule = class DatabaseModule {
    dbConn;
    constructor(dbConn) {
        this.dbConn = dbConn;
    }
    onModuleInit() {
        this.dbConn.registerEngine('mysql', () => new mysql_connector_1.MySQLConnector());
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [database_connection_service_1.DatabaseConnectionService],
        exports: [database_connection_service_1.DatabaseConnectionService],
    }),
    __metadata("design:paramtypes", [database_connection_service_1.DatabaseConnectionService])
], DatabaseModule);
//# sourceMappingURL=database.module.js.map