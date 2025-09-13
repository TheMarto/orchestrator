export declare const SUPPORTED_ENGINES: readonly ["mysql", "postgres", "sqlite", "mongo"];
export declare class DbConfigDto {
    engine: string;
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
export declare class DbConnectPayloadDto {
    alias?: string;
    config: DbConfigDto;
}
