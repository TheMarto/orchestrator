export declare const HYBRID_STRATEGIES: readonly ["CONDITIONAL", "PARALLEL", "SEQUENTIAL"];
export declare class HybridQueryDto {
    text: string;
    alias?: string;
    strategy?: string;
    onlyDb?: boolean;
    onlyRag?: boolean;
    latencyBudgetMs?: number;
    maxResults?: number;
    minScore?: number;
}
