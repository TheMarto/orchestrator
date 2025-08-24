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
var RagService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagService = void 0;
const common_1 = require("@nestjs/common");
const embedding_service_1 = require("../embedding/embedding.service");
const vector_service_1 = require("../vector/vector.service");
const ollama_util_1 = require("../../utils/ollama.util");
let RagService = RagService_1 = class RagService {
    embeddingService;
    vectorService;
    logger = new common_1.Logger(RagService_1.name);
    constructor(embeddingService, vectorService) {
        this.embeddingService = embeddingService;
        this.vectorService = vectorService;
    }
    async processQuery(query, maxResults = 5, minScore = 0.7, model) {
        const startTime = Date.now();
        try {
            this.logger.log(`Processing RAG query: "${query.substring(0, 50)}..."`);
            const queryEmbedding = await this.embeddingService.generateEmbedding(query);
            this.logger.debug(`Query embedding generated`);
            const similarChunks = await this.vectorService.searchSimilar(queryEmbedding, maxResults, minScore);
            this.logger.log(`Found ${similarChunks.length} relevant chunks`);
            const context = this.buildContext(query, similarChunks);
            if (model) {
                ollama_util_1.OllamaUtil.setModel(model);
            }
            const ollamaResponse = await ollama_util_1.OllamaUtil.generateResponse(query, context.contextText, this.buildSystemPrompt());
            const processingTime = Date.now() - startTime;
            this.logger.log(`RAG query processed successfully in ${processingTime}ms`);
            return {
                response: ollamaResponse.response,
                sources: similarChunks,
                processingTime,
            };
        }
        catch (error) {
            this.logger.error(`Error processing RAG query:`, error);
            throw error;
        }
    }
    buildContext(query, chunks) {
        if (chunks.length === 0) {
            return {
                query,
                relevantChunks: [],
                contextText: 'No se encontraron documentos relevantes para responder esta pregunta.',
            };
        }
        const sortedChunks = chunks.sort((a, b) => b.score - a.score);
        let contextText = 'Información relevante de los documentos:\n\n';
        sortedChunks.forEach((chunk, index) => {
            contextText += `[Documento ${index + 1}: ${chunk.payload.fileName}]\n`;
            contextText += `${chunk.payload.content}\n`;
            contextText += `(Relevancia: ${(chunk.score * 100).toFixed(1)}%)\n\n`;
        });
        return {
            query,
            relevantChunks: sortedChunks,
            contextText: contextText.trim(),
        };
    }
    buildSystemPrompt() {
        return `Eres un asistente especializado que responde preguntas basándose exclusivamente en los documentos proporcionados.

INSTRUCCIONES:
1. Responde SOLO basándote en la información del contexto proporcionado
2. Si la información no está en el contexto, di claramente "No tengo información suficiente en los documentos para responder esta pregunta"
3. Cita los documentos relevantes cuando sea apropiado
4. Sé preciso y conciso
5. Si hay información contradictoria en diferentes documentos, menciona las diferencias

FORMATO DE RESPUESTA:
- Respuesta clara y directa
- Menciona las fuentes cuando sea relevante
- Si usas información de múltiples documentos, organiza la respuesta de forma coherente`;
    }
    async searchDocuments(query, maxResults = 5, minScore = 0.7) {
        try {
            this.logger.log(`Searching documents for: "${query.substring(0, 50)}..."`);
            const queryEmbedding = await this.embeddingService.generateEmbedding(query);
            const results = await this.vectorService.searchSimilar(queryEmbedding, maxResults, minScore);
            this.logger.log(`Found ${results.length} matching documents`);
            return results;
        }
        catch (error) {
            this.logger.error('Error searching documents:', error);
            throw error;
        }
    }
    async generateResponse(query, context, model) {
        const startTime = Date.now();
        try {
            this.logger.log(`Generating response for query: "${query.substring(0, 50)}..."`);
            if (model) {
                ollama_util_1.OllamaUtil.setModel(model);
            }
            const result = await ollama_util_1.OllamaUtil.generateResponse(query, context, this.buildSystemPrompt());
            const processingTime = Date.now() - startTime;
            this.logger.log(`Response generated in ${processingTime}ms`);
            return {
                response: result.response,
                model: result.model,
                processingTime,
            };
        }
        catch (error) {
            this.logger.error('Error generating response:', error);
            throw error;
        }
    }
    async getRAGStats() {
        try {
            const vectorStats = await this.vectorService.getCollectionInfo();
            const embeddingInfo = this.embeddingService.getModelInfo();
            const ollamaConfig = ollama_util_1.OllamaUtil.getConfig();
            const ollamaHealth = await ollama_util_1.OllamaUtil.healthCheck();
            return {
                vectors: {
                    totalDocuments: vectorStats.points_count || 0,
                    collectionStatus: vectorStats.status || 'unknown',
                },
                embedding: {
                    model: embeddingInfo.model,
                    dimension: embeddingInfo.dimension,
                    maxLength: embeddingInfo.maxLength,
                },
                llm: {
                    host: `${ollamaConfig.host}:${ollamaConfig.port}`,
                    model: ollamaConfig.model,
                    status: ollamaHealth.status,
                    availableModels: ollamaHealth.models || [],
                },
            };
        }
        catch (error) {
            this.logger.error('Error getting RAG stats:', error);
            throw error;
        }
    }
};
exports.RagService = RagService;
exports.RagService = RagService = RagService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [embedding_service_1.EmbeddingService,
        vector_service_1.VectorService])
], RagService);
//# sourceMappingURL=rag.service.js.map