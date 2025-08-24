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
var DocumentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const document_dto_1 = require("../../dto/document.dto");
const document_service_1 = require("../../services/document/document.service");
const ollama_util_1 = require("../../utils/ollama.util");
let DocumentsController = DocumentsController_1 = class DocumentsController {
    documentService;
    logger = new common_1.Logger(DocumentsController_1.name);
    constructor(documentService) {
        this.documentService = documentService;
    }
    async indexDocument(dto) {
        try {
            this.logger.log(`Indexing document: ${dto.fileName}`);
            const result = await this.documentService.indexDocument(dto);
            return {
                success: true,
                message: `Document "${dto.fileName}" indexed successfully`,
                data: result,
            };
        }
        catch (error) {
            this.logger.error('Error indexing document:', error);
            return {
                success: false,
                message: 'Error indexing document',
                error: error.message,
            };
        }
    }
    async indexMultipleDocuments(dto) {
        try {
            this.logger.log(`Indexing ${dto.documents.length} documents`);
            const result = await this.documentService.indexMultipleDocuments(dto);
            return {
                success: true,
                message: `Batch indexing completed: ${result.documentsProcessed} documents processed`,
                data: result,
            };
        }
        catch (error) {
            this.logger.error('Error in batch indexing:', error);
            return {
                success: false,
                message: 'Error in batch indexing',
                error: error.message,
            };
        }
    }
    async indexFromFile(dto) {
        try {
            this.logger.log(`Indexing file: ${dto.filePath}`);
            const result = await this.documentService.indexFromFile(dto);
            return {
                success: true,
                message: `File "${dto.filePath}" indexed successfully`,
                data: result,
            };
        }
        catch (error) {
            this.logger.error('Error indexing file:', error);
            return {
                success: false,
                message: 'Error indexing file',
                error: error.message,
            };
        }
    }
    async indexFromDirectory(body) {
        try {
            this.logger.log(`Indexing directory: ${body.directoryPath}`);
            const result = await this.documentService.indexFromDirectory(body.directoryPath, body.source);
            return {
                success: true,
                message: `Directory "${body.directoryPath}" indexed successfully`,
                data: result,
            };
        }
        catch (error) {
            this.logger.error('Error indexing directory:', error);
            return {
                success: false,
                message: 'Error indexing directory',
                error: error.message,
            };
        }
    }
    async getIndexingStats() {
        try {
            const stats = await this.documentService.getIndexingStats();
            return {
                success: true,
                message: 'Statistics retrieved successfully',
                data: stats,
            };
        }
        catch (error) {
            this.logger.error('Error getting stats:', error);
            return {
                success: false,
                message: 'Error getting statistics',
                error: error.message,
            };
        }
    }
    async clearIndex() {
        try {
            this.logger.log('Clearing index...');
            const result = await this.documentService.clearIndex();
            return {
                success: true,
                message: 'Index cleared successfully',
                data: result,
            };
        }
        catch (error) {
            this.logger.error('Error clearing index:', error);
            return {
                success: false,
                message: 'Error clearing index',
                error: error.message,
            };
        }
    }
    async healthCheck() {
        try {
            const stats = await this.documentService.getIndexingStats();
            return {
                success: true,
                message: 'Document service is healthy',
                data: {
                    status: 'healthy',
                    totalVectors: stats.totalVectors,
                    embeddingModel: stats.embeddingModel,
                },
            };
        }
        catch (error) {
            this.logger.error('Health check failed:', error);
            return {
                success: false,
                message: 'Document service is unhealthy',
                error: error.message,
            };
        }
    }
    async ollamaHealthCheck() {
        try {
            const health = await ollama_util_1.OllamaUtil.healthCheck();
            return {
                success: health.status === 'healthy',
                message: health.status === 'healthy' ? 'Ollama connection is healthy' : 'Ollama connection failed',
                data: health,
            };
        }
        catch (error) {
            this.logger.error('Ollama health check failed:', error);
            return {
                success: false,
                message: 'Error checking Ollama health',
                error: error.message,
            };
        }
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)('index'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_dto_1.IndexDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "indexDocument", null);
__decorate([
    (0, common_1.Post)('index-multiple'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_dto_1.IndexMultipleDocumentsDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "indexMultipleDocuments", null);
__decorate([
    (0, common_1.Post)('index-file'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_dto_1.IndexFromFileDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "indexFromFile", null);
__decorate([
    (0, common_1.Post)('index-directory'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "indexFromDirectory", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getIndexingStats", null);
__decorate([
    (0, common_1.Delete)('clear'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "clearIndex", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)('ollama-health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "ollamaHealthCheck", null);
exports.DocumentsController = DocumentsController = DocumentsController_1 = __decorate([
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [document_service_1.DocumentService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map