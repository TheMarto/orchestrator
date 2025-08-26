import { DocumentChunk } from '../interfaces/types';
export declare class ChunkingUtil {
    private static readonly config;
    static chunkDocument(content: string, fileName: string, source?: string): DocumentChunk[];
    private static cleanText;
    private static smartSplit;
    private static splitBySeparators;
    private static splitLongSentence;
    private static getOverlapText;
}
