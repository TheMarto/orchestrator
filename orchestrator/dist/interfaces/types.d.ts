export interface DocumentChunk {
    id: string;
    content: string;
    metadata: ChunkMetadata;
    embedding?: number[];
}
export interface ChunkMetadata {
    source: string;
    fileName: string;
    chunkIndex: number;
    totalChunks: number;
    charCount: number;
    timestamp: Date;
}
export interface VectorSearchResult {
    id: string;
    score: number;
    payload: ChunkMetadata & {
        content: string;
    };
}
export interface RAGContext {
    query: string;
    relevantChunks: VectorSearchResult[];
    contextText: string;
}
export interface ChatResponse {
    response: string;
    sources: VectorSearchResult[];
    processingTime: number;
}
export interface OllamaResponse {
    response: string;
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    prompt_eval_duration?: number;
}
export interface QdrantConfig {
    host: string;
    port: number;
}
export interface EmbeddingConfig {
    model: string;
    maxLength: number;
}
export interface ChunkingConfig {
    chunkSize: number;
    chunkOverlap: number;
    separators: string[];
}
