export type SupportedEngine = 'mysql' | 'postgres' | 'sqlite' | 'mongo';
export interface DbConfig {
    engine: SupportedEngine;
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    ssl?: boolean;
    file?: string;
    uri?: string;
    options?: Record<string, any>;
}
export interface IDBConnector {
    readonly engine: SupportedEngine;
    connect(config: DbConfig): Promise<void>;
    disconnect(): Promise<void>;
    health(): Promise<{
        ok: boolean;
        details?: any;
    }>;
    query<T = any>(statementOrDsl: any, params?: any): Promise<T[]>;
}
export interface SemanticField {
    name: string;
    physicalPath: string;
    type: string;
    pii?: boolean;
    synonyms?: string[];
    examples?: string[];
    quality?: {
        nullPct?: number;
        distinctPct?: number;
    };
}
export interface Relationship {
    from: string;
    to: string;
    kind: 'fk' | 'ref' | 'inferred';
    via?: string[];
}
export interface SemanticEntity {
    name: string;
    physicalName: string;
    synonyms?: string[];
    fields: SemanticField[];
    relationships?: Relationship[];
    notes?: string;
}
export interface SemanticCatalog {
    engine: SupportedEngine;
    database?: string;
    entities: SemanticEntity[];
    generatedAt: string;
}
