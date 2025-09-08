"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionService = void 0;
const common_1 = require("@nestjs/common");
let DatabaseConnectionService = class DatabaseConnectionService {
    factories = new Map();
    active = new Map();
    registerEngine(engine, factory) {
        this.factories.set(engine, factory);
    }
    async connect(alias, config) {
        const factory = this.factories.get(config.engine);
        if (!factory)
            throw new Error(`Engine not supported or not registered: ${config.engine}`);
        const connector = factory();
        await connector.connect(config);
        const health = await connector.health();
        if (!health.ok) {
            await connector.disconnect();
            throw new Error(`DB health check failed: ${health.details?.error || 'unknown'}`);
        }
        this.active.set(alias, connector);
    }
    async disconnect(alias) {
        const conn = this.active.get(alias);
        if (!conn)
            return;
        await conn.disconnect();
        this.active.delete(alias);
    }
    async health(alias) {
        const conn = this.getOrThrow(alias);
        return conn.health();
    }
    async query(alias, statementOrDsl, params) {
        const conn = this.getOrThrow(alias);
        return conn.query(statementOrDsl, params);
    }
    get(alias) {
        return this.active.get(alias);
    }
    listAliases() {
        return Array.from(this.active.keys());
    }
    getOrThrow(alias) {
        const conn = this.active.get(alias);
        if (!conn) {
            throw new Error(`No active DB connection for alias: ${alias}`);
        }
        return conn;
    }
};
exports.DatabaseConnectionService = DatabaseConnectionService;
exports.DatabaseConnectionService = DatabaseConnectionService = __decorate([
    (0, common_1.Injectable)()
], DatabaseConnectionService);
//# sourceMappingURL=database-connection.service.js.map