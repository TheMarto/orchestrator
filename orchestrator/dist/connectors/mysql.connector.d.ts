import { IDBConnector, DbConfig, SupportedEngine } from 'src/interfaces/db.types';
export declare class MySQLConnector implements IDBConnector {
    readonly engine: SupportedEngine;
    private pool;
    private loadMysql;
    connect(config: DbConfig): Promise<void>;
    disconnect(): Promise<void>;
    health(): Promise<{
        ok: boolean;
        details?: any;
    }>;
    query<T = any>(statement: string, params?: any): Promise<T[]>;
}
