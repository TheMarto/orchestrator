"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const vector_service_1 = require("./services/vector/vector.service");
const document_service_1 = require("./services/document/document.service");
const embedding_service_1 = require("./services/embedding/embedding.service");
const documents_controller_1 = require("./controllers/documents/documents.controller");
const chat_controller_1 = require("./controllers/chat/chat.controller");
const rag_service_1 = require("./services/rag/rag.service");
const ollama_proxy_controller_1 = require("./controllers/ollama-proxy/ollama-proxy.controller");
const database_module_1 = require("./module/database.module");
const db_controller_1 = require("./controllers/db/db.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [
            app_controller_1.AppController,
            documents_controller_1.DocumentsController,
            chat_controller_1.ChatController,
            ollama_proxy_controller_1.OllamaProxyController,
            db_controller_1.DbController
        ],
        providers: [
            app_service_1.AppService,
            embedding_service_1.EmbeddingService,
            vector_service_1.VectorService,
            document_service_1.DocumentService,
            rag_service_1.RagService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map