import { IndexDocumentDto, IndexFromFileDto, IndexMultipleDocumentsDto } from 'src/dto/document.dto';
import { DocumentService } from 'src/services/document/document.service';
export declare class DocumentsController {
    private readonly documentService;
    private readonly logger;
    constructor(documentService: DocumentService);
    indexDocument(dto: IndexDocumentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            chunksCreated: number;
            fileName: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    indexMultipleDocuments(dto: IndexMultipleDocumentsDto): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            documentsProcessed: number;
            totalChunks: number;
            results: Array<{
                fileName: string;
                chunksCreated: number;
                success: boolean;
                error?: string;
            }>;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    indexFromFile(dto: IndexFromFileDto): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            chunksCreated: number;
            fileName: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    indexFromDirectory(body: {
        directoryPath: string;
        source?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            documentsProcessed: number;
            totalChunks: number;
            results: Array<{
                fileName: string;
                chunksCreated: number;
                success: boolean;
                error?: string;
            }>;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getIndexingStats(): Promise<{
        success: boolean;
        message: string;
        data: {
            totalVectors: number;
            embeddingModel: string;
            embeddingDimension: number;
            maxTextLength: number;
            collectionStatus: "green" | "yellow" | "grey" | "red";
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    clearIndex(): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            message: string;
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
            totalVectors: number;
            embeddingModel: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
}
