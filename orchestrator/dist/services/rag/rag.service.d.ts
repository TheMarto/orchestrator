import { EmbeddingService } from '../embedding/embedding.service';
import { VectorService } from '../vector/vector.service';
import { ChatResponse, VectorSearchResult } from 'src/interfaces/types';
export declare class RagService {
    private readonly embeddingService;
    private readonly vectorService;
    private readonly logger;
    constructor(embeddingService: EmbeddingService, vectorService: VectorService);
    processQuery(query: string, maxResults?: number, minScore?: number, model?: string): Promise<ChatResponse>;
    private buildContext;
    private buildSystemPrompt;
    searchDocuments(query: string, maxResults?: number, minScore?: number): Promise<VectorSearchResult[]>;
    generateResponse(query: string, context: string, model?: string): Promise<{
        response: string;
        model: string;
        processingTime: number;
    }>;
    getRAGStats(): Promise<{
        vectors: {
            totalDocuments: number;
            collectionStatus: "green" | "yellow" | "grey" | "red";
        };
        embedding: {
            model: string;
            dimension: number;
            maxLength: number;
        };
        llm: {
            host: string;
            model: string;
            status: "healthy" | "unhealthy";
            availableModels: string[];
        };
    }>;
}
