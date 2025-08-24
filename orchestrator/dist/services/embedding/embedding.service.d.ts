import { OnModuleInit } from '@nestjs/common';
export declare class EmbeddingService implements OnModuleInit {
    private readonly logger;
    private embedder;
    private pipeline;
    private readonly config;
    onModuleInit(): Promise<void>;
    generateEmbedding(text: string): Promise<number[]>;
    generateEmbeddings(texts: string[]): Promise<number[][]>;
    getEmbeddingDimension(): number;
    getModelInfo(): {
        model: string;
        maxLength: number;
        dimension: number;
    };
}
