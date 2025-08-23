"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DocumentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const embedding_service_1 = require("../embedding/embedding.service");
const vector_service_1 = require("../vector/vector.service");
const chunking_util_1 = require("../../utils/chunking.util");
let DocumentService = DocumentService_1 = class DocumentService {
    embeddingService;
    vectorService;
    logger = new common_1.Logger(DocumentService_1.name);
    constructor(embeddingService, vectorService) {
        this.embeddingService = embeddingService;
        this.vectorService = vectorService;
    }
    async indexDocument(dto) {
        try {
            this.logger.log(`Starting indexation of document: ${dto.fileName}`);
            const chunks = chunking_util_1.ChunkingUtil.chunkDocument(dto.content, dto.fileName, dto.source || 'direct_upload');
            this.logger.log(`Document chunked into ${chunks.length} parts`);
            const contents = chunks.map(chunk => chunk.content);
            const embeddings = await this.embeddingService.generateEmbeddings(contents);
            const chunksWithEmbeddings = chunks.map((chunk, index) => ({
                ...chunk,
                embedding: embeddings[index],
            }));
            await this.vectorService.indexChunks(chunksWithEmbeddings);
            this.logger.log(`Document ${dto.fileName} indexed successfully`);
            return {
                success: true,
                chunksCreated: chunks.length,
                fileName: dto.fileName,
            };
        }
        catch (error) {
            this.logger.error(`Error indexing document ${dto.fileName}:`, error);
            throw error;
        }
    }
    async indexMultipleDocuments(dto) {
        try {
            this.logger.log(`Starting batch indexation of ${dto.documents.length} documents`);
            const results = [];
            let totalChunks = 0;
            let successCount = 0;
            for (const doc of dto.documents) {
                try {
                    const result = await this.indexDocument(doc);
                    results.push({
                        fileName: doc.fileName,
                        chunksCreated: result.chunksCreated,
                        success: true,
                    });
                    totalChunks += result.chunksCreated;
                    successCount++;
                }
                catch (error) {
                    this.logger.error(`Failed to index document ${doc.fileName}:`, error);
                    results.push({
                        fileName: doc.fileName,
                        chunksCreated: 0,
                        success: false,
                        error: error.message,
                    });
                }
            }
            this.logger.log(`Batch indexation completed: ${successCount}/${dto.documents.length} successful`);
            return {
                success: successCount > 0,
                documentsProcessed: successCount,
                totalChunks,
                results,
            };
        }
        catch (error) {
            this.logger.error('Error in batch indexation:', error);
            throw error;
        }
    }
    async indexFromFile(dto) {
        try {
            this.logger.log(`Reading file: ${dto.filePath}`);
            const fileExists = await this.fileExists(dto.filePath);
            if (!fileExists) {
                throw new Error(`File not found: ${dto.filePath}`);
            }
            const content = await fs.readFile(dto.filePath, 'utf-8');
            const fileName = path.basename(dto.filePath);
            return await this.indexDocument({
                content,
                fileName,
                source: dto.source || 'file_upload',
            });
        }
        catch (error) {
            this.logger.error(`Error reading file ${dto.filePath}:`, error);
            throw error;
        }
    }
    async indexFromDirectory(directoryPath, source) {
        try {
            this.logger.log(`Scanning directory: ${directoryPath}`);
            const files = await fs.readdir(directoryPath);
            const textFiles = files.filter(file => file.endsWith('.txt') ||
                file.endsWith('.md') ||
                file.endsWith('.text'));
            if (textFiles.length === 0) {
                this.logger.warn(`No text files found in directory: ${directoryPath}`);
                return {
                    success: false,
                    documentsProcessed: 0,
                    totalChunks: 0,
                    results: [],
                };
            }
            this.logger.log(`Found ${textFiles.length} text files to index`);
            const documents = [];
            for (const file of textFiles) {
                try {
                    const filePath = path.join(directoryPath, file);
                    const content = await fs.readFile(filePath, 'utf-8');
                    documents.push({
                        content,
                        fileName: file,
                        source: source || 'directory_scan',
                    });
                }
                catch (error) {
                    this.logger.error(`Error reading file ${file}:`, error);
                }
            }
            return await this.indexMultipleDocuments({ documents });
        }
        catch (error) {
            this.logger.error(`Error scanning directory ${directoryPath}:`, error);
            throw error;
        }
    }
    async getIndexingStats() {
        try {
            const collectionInfo = await this.vectorService.getCollectionInfo();
            const embeddingInfo = this.embeddingService.getModelInfo();
            return {
                totalVectors: collectionInfo.vectors_count || 0,
                embeddingModel: embeddingInfo.model,
                embeddingDimension: embeddingInfo.dimension,
                maxTextLength: embeddingInfo.maxLength,
                collectionStatus: collectionInfo.status,
            };
        }
        catch (error) {
            this.logger.error('Error getting indexing stats:', error);
            throw error;
        }
    }
    async clearIndex() {
        try {
            await this.vectorService.deleteCollection();
            this.logger.log('Index cleared successfully');
            return {
                success: true,
                message: 'Index cleared successfully',
            };
        }
        catch (error) {
            this.logger.error('Error clearing index:', error);
            throw error;
        }
    }
    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = DocumentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [embedding_service_1.EmbeddingService,
        vector_service_1.VectorService])
], DocumentService);
//# sourceMappingURL=document.service.js.map