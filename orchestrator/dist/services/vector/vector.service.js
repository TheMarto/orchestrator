"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var VectorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorService = void 0;
const common_1 = require("@nestjs/common");
const js_client_rest_1 = require("@qdrant/js-client-rest");
let VectorService = VectorService_1 = class VectorService {
    logger = new common_1.Logger(VectorService_1.name);
    client;
    collectionName = 'documents_rag';
    config = {
        host: '10.10.10.102',
        port: 6333,
    };
    async onModuleInit() {
        this.client = new js_client_rest_1.QdrantClient({
            url: `http://${this.config.host}:${this.config.port}`,
        });
        await this.ensureCollection();
        this.logger.log('VectorService initialized and connected to Qdrant');
    }
    async ensureCollection() {
        try {
            const collections = await this.client.getCollections();
            const collectionExists = collections.collections.some((col) => col.name === this.collectionName);
            if (!collectionExists) {
                await this.client.createCollection(this.collectionName, {
                    vectors: {
                        size: 384,
                        distance: 'Cosine',
                    },
                });
                this.logger.log(`Collection '${this.collectionName}' created`);
            }
            else {
                this.logger.log(`Collection '${this.collectionName}' already exists`);
            }
        }
        catch (error) {
            this.logger.error('Error ensuring collection exists:', error);
            throw error;
        }
    }
    async indexChunks(chunks) {
        try {
            const validChunks = chunks.filter(chunk => chunk.embedding && chunk.embedding.length > 0);
            if (validChunks.length === 0) {
                throw new Error('No valid chunks with embeddings to index');
            }
            const points = validChunks.map((chunk) => ({
                id: chunk.id,
                vector: chunk.embedding,
                payload: {
                    content: chunk.content,
                    ...chunk.metadata,
                },
            }));
            await this.client.upsert(this.collectionName, {
                wait: true,
                points: points,
            });
            this.logger.log(`Indexed ${validChunks.length} chunks successfully`);
        }
        catch (error) {
            this.logger.error('Error indexing chunks:', error);
            throw error;
        }
    }
    async searchSimilar(queryEmbedding, limit = 5, scoreThreshold = 0.7) {
        try {
            const searchResult = await this.client.search(this.collectionName, {
                vector: queryEmbedding,
                limit: limit,
                score_threshold: scoreThreshold,
                with_payload: true,
            });
            return searchResult.map((result) => {
                const payload = result.payload;
                if (!payload || typeof payload !== 'object') {
                    throw new Error('Invalid payload structure in search result');
                }
                return {
                    id: result.id.toString(),
                    score: result.score,
                    payload: {
                        content: payload.content,
                        source: payload.source,
                        fileName: payload.fileName,
                        chunkIndex: payload.chunkIndex,
                        totalChunks: payload.totalChunks,
                        charCount: payload.charCount,
                        timestamp: new Date(payload.timestamp),
                    },
                };
            });
        }
        catch (error) {
            this.logger.error('Error searching vectors:', error);
            throw error;
        }
    }
    async deleteCollection() {
        try {
            await this.client.deleteCollection(this.collectionName);
            this.logger.log(`Collection '${this.collectionName}' deleted`);
        }
        catch (error) {
            this.logger.error('Error deleting collection:', error);
            throw error;
        }
    }
    async getCollectionInfo() {
        try {
            return await this.client.getCollection(this.collectionName);
        }
        catch (error) {
            this.logger.error('Error getting collection info:', error);
            throw error;
        }
    }
};
exports.VectorService = VectorService;
exports.VectorService = VectorService = VectorService_1 = __decorate([
    (0, common_1.Injectable)()
], VectorService);
//# sourceMappingURL=vector.service.js.map