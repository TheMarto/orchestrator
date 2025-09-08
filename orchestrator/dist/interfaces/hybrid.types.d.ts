export type HybridStrategy = 'CONDITIONAL' | 'PARALLEL' | 'SEQUENTIAL';
export type EntityType = 'product' | 'client' | 'ticket' | 'user' | 'group' | 'organization' | 'date' | 'email' | 'id' | 'free';
export interface EntityHit {
    type: EntityType;
    value: string;
    confidence: number;
}
export interface PlannerInput {
    text: string;
    entities: EntityHit[];
    session?: Record<string, any>;
}
export interface PlanStep {
    source: 'db' | 'rag';
    purpose: string;
    spec: any;
    required?: boolean;
}
export interface Plan {
    strategy: HybridStrategy;
    steps: PlanStep[];
    needDisambiguation?: string[];
    latencyBudgetMs?: number;
}
export interface SourceResult {
    source: 'db' | 'rag';
    score?: number;
    data: any;
    trace?: any;
}
export interface HybridResult {
    items: SourceResult[];
    explanation: string;
}
