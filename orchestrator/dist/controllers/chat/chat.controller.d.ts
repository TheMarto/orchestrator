import { ChatQueryDto } from 'src/dto/chat.dto';
import { RagService } from 'src/services/rag/rag.service';
export declare class ChatController {
    private readonly ragService;
    private readonly logger;
    constructor(ragService: RagService);
    query(dto: ChatQueryDto): Promise<{
        success: boolean;
        message: string;
        data: {
            query: string;
            response: string;
            sources: {
                fileName: string;
                content: string;
                relevance: number;
                source: string;
            }[];
            processingTime: number;
            sourceCount: number;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    searchOnly(dto: ChatQueryDto): Promise<{
        success: boolean;
        message: string;
        data: {
            query: string;
            results: {
                fileName: string;
                content: string;
                relevance: number;
                source: string;
                chunkIndex: number;
            }[];
            resultCount: number;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    generateOnly(body: {
        query: string;
        context: string;
        model?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            query: string;
            response: string;
            model: string;
            processingTime: number;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getStats(): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    healthCheck(): Promise<{
        success: boolean;
        message: string;
        data: {
            status: string;
            components: {
                vectorDB: string;
                llm: string;
                embedding: string;
            };
            summary: {
                totalDocuments: number;
                embeddingModel: string;
                llmModel: string;
                availableModels: number;
            };
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
}
