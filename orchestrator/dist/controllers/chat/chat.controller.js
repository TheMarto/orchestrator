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
var ChatController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_dto_1 = require("../../dto/chat.dto");
const rag_service_1 = require("../../services/rag/rag.service");
let ChatController = ChatController_1 = class ChatController {
    ragService;
    logger = new common_1.Logger(ChatController_1.name);
    constructor(ragService) {
        this.ragService = ragService;
    }
    async query(dto) {
        try {
            this.logger.log(`Processing RAG query: "${dto.query.substring(0, 50)}..."`);
            const result = await this.ragService.processQuery(dto.query, dto.maxResults, dto.minScore);
            return {
                success: true,
                message: 'Query processed successfully',
                data: {
                    query: dto.query,
                    response: result.response,
                    sources: result.sources.map(source => ({
                        fileName: source.payload.fileName,
                        content: source.payload.content.substring(0, 200) + '...',
                        relevance: Math.round(source.score * 100),
                        source: source.payload.source,
                    })),
                    processingTime: result.processingTime,
                    sourceCount: result.sources.length,
                },
            };
        }
        catch (error) {
            this.logger.error('Error processing query:', error);
            return {
                success: false,
                message: 'Error processing query',
                error: error.message,
            };
        }
    }
    async searchOnly(dto) {
        try {
            this.logger.log(`Searching for: "${dto.query.substring(0, 50)}..."`);
            const results = await this.ragService.searchDocuments(dto.query, dto.maxResults, dto.minScore);
            return {
                success: true,
                message: `Found ${results.length} relevant documents`,
                data: {
                    query: dto.query,
                    results: results.map(result => ({
                        fileName: result.payload.fileName,
                        content: result.payload.content,
                        relevance: Math.round(result.score * 100),
                        source: result.payload.source,
                        chunkIndex: result.payload.chunkIndex,
                    })),
                    resultCount: results.length,
                },
            };
        }
        catch (error) {
            this.logger.error('Error searching documents:', error);
            return {
                success: false,
                message: 'Error searching documents',
                error: error.message,
            };
        }
    }
    async generateOnly(body) {
        try {
            this.logger.log(`Generating response for: "${body.query.substring(0, 50)}..."`);
            const result = await this.ragService.generateResponse(body.query, body.context, body.model);
            return {
                success: true,
                message: 'Response generated successfully',
                data: {
                    query: body.query,
                    response: result.response,
                    model: result.model,
                    processingTime: result.processingTime,
                },
            };
        }
        catch (error) {
            this.logger.error('Error generating response:', error);
            return {
                success: false,
                message: 'Error generating response',
                error: error.message,
            };
        }
    }
    async getStats() {
        try {
            const stats = await this.ragService.getRAGStats();
            return {
                success: true,
                message: 'RAG statistics retrieved successfully',
                data: stats,
            };
        }
        catch (error) {
            this.logger.error('Error getting RAG stats:', error);
            return {
                success: false,
                message: 'Error getting RAG statistics',
                error: error.message,
            };
        }
    }
    async healthCheck() {
        try {
            const stats = await this.ragService.getRAGStats();
            const isHealthy = stats.vectors.collectionStatus === 'green' &&
                stats.llm.status === 'healthy';
            return {
                success: isHealthy,
                message: isHealthy ? 'RAG system is healthy' : 'RAG system has issues',
                data: {
                    status: isHealthy ? 'healthy' : 'unhealthy',
                    components: {
                        vectorDB: stats.vectors.collectionStatus === 'green' ? 'healthy' : 'unhealthy',
                        llm: stats.llm.status === 'healthy' ? 'healthy' : 'unhealthy',
                        embedding: 'healthy',
                    },
                    summary: {
                        totalDocuments: stats.vectors.totalDocuments,
                        embeddingModel: stats.embedding.model,
                        llmModel: stats.llm.model,
                        availableModels: stats.llm.availableModels.length,
                    },
                },
            };
        }
        catch (error) {
            this.logger.error('RAG health check failed:', error);
            return {
                success: false,
                message: 'RAG health check failed',
                error: error.message,
            };
        }
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('query'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChatQueryDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "query", null);
__decorate([
    (0, common_1.Post)('search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChatQueryDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "searchOnly", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "generateOnly", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "healthCheck", null);
exports.ChatController = ChatController = ChatController_1 = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [rag_service_1.RagService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map