"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmbeddingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
const common_1 = require("@nestjs/common");
const transformers_1 = require("@xenova/transformers");
let EmbeddingService = EmbeddingService_1 = class EmbeddingService {
    logger = new common_1.Logger(EmbeddingService_1.name);
    embedder;
    config = {
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        maxLength: 512,
    };
    async onModuleInit() {
        try {
            this.logger.log('Loading embedding model...');
            this.embedder = await (0, transformers_1.pipeline)('feature-extraction', this.config.model, {
                quantized: false,
            });
            this.logger.log('Embedding model loaded successfully');
        }
        catch (error) {
            this.logger.error('Error loading embedding model:', error);
            throw error;
        }
    }
    async generateEmbedding(text) {
        try {
            const truncatedText = text.length > this.config.maxLength
                ? text.substring(0, this.config.maxLength)
                : text;
            const output = await this.embedder(truncatedText, {
                pooling: 'mean',
                normalize: true,
            });
            let embedding;
            if (output && typeof output === 'object' && 'data' in output) {
                embedding = Array.from(output.data).map(x => Number(x));
            }
            else if (Array.isArray(output)) {
                embedding = output.map(x => Number(x));
            }
            else {
                throw new Error('Unexpected output format from embedding model');
            }
            return embedding;
        }
        catch (error) {
            this.logger.error('Error generating embedding:', error);
            throw error;
        }
    }
    async generateEmbeddings(texts) {
        try {
            this.logger.log(`Generating embeddings for ${texts.length} texts`);
            const batchSize = 10;
            const embeddings = [];
            for (let i = 0; i < texts.length; i += batchSize) {
                const batch = texts.slice(i, i + batchSize);
                const batchPromises = batch.map(text => this.generateEmbedding(text));
                const batchEmbeddings = await Promise.all(batchPromises);
                embeddings.push(...batchEmbeddings);
                this.logger.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);
            }
            return embeddings;
        }
        catch (error) {
            this.logger.error('Error generating batch embeddings:', error);
            throw error;
        }
    }
    getEmbeddingDimension() {
        return 384;
    }
    getModelInfo() {
        return {
            model: this.config.model,
            maxLength: this.config.maxLength,
            dimension: this.getEmbeddingDimension(),
        };
    }
};
exports.EmbeddingService = EmbeddingService;
exports.EmbeddingService = EmbeddingService = EmbeddingService_1 = __decorate([
    (0, common_1.Injectable)()
], EmbeddingService);
//# sourceMappingURL=embedding.service.js.map