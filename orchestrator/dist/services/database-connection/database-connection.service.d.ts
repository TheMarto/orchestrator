import { DbConfig, IDBConnector, SupportedEngine } from '../../interfaces/db.types';
type ConnectorFactory = () => IDBConnector;
export declare class DatabaseConnectionService {
    private factories;
    private active;
    registerEngine(engine: SupportedEngine, factory: ConnectorFactory): void;
    connect(alias: string, config: DbConfig): Promise<void>;
    disconnect(alias: string): Promise<void>;
    health(alias: string): Promise<{
        ok: boolean;
        details?: any;
    }>;
    query<T = any>(alias: string, statementOrDsl: any, params?: any): Promise<T[]>;
    get(alias: string): IDBConnector | undefined;
    listAliases(): string[];
    private getOrThrow;
}
export {};
