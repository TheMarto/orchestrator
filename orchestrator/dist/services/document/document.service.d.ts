import { EmbeddingService } from '../embedding/embedding.service';
import { VectorService } from '../vector/vector.service';
import { IndexDocumentDto, IndexFromFileDto, IndexMultipleDocumentsDto } from 'src/dto/document.dto';
export declare class DocumentService {
    private readonly embeddingService;
    private readonly vectorService;
    private readonly logger;
    constructor(embeddingService: EmbeddingService, vectorService: VectorService);
    indexDocument(dto: IndexDocumentDto): Promise<{
        success: boolean;
        chunksCreated: number;
        fileName: string;
    }>;
    indexMultipleDocuments(dto: IndexMultipleDocumentsDto): Promise<{
        success: boolean;
        documentsProcessed: number;
        totalChunks: number;
        results: Array<{
            fileName: string;
            chunksCreated: number;
            success: boolean;
            error?: string;
        }>;
    }>;
    indexFromFile(dto: IndexFromFileDto): Promise<{
        success: boolean;
        chunksCreated: number;
        fileName: string;
    }>;
    indexFromDirectory(directoryPath: string, source?: string): Promise<{
        success: boolean;
        documentsProcessed: number;
        totalChunks: number;
        results: Array<{
            fileName: string;
            chunksCreated: number;
            success: boolean;
            error?: string;
        }>;
    }>;
    getIndexingStats(): Promise<{
        totalVectors: number;
        embeddingModel: string;
        embeddingDimension: number;
        maxTextLength: number;
        collectionStatus: "green" | "yellow" | "grey" | "red";
    }>;
    clearIndex(): Promise<{
        success: boolean;
        message: string;
    }>;
    private fileExists;
}
