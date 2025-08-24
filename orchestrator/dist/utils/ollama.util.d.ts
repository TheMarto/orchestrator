export interface OllamaConfig {
    host: string;
    port: number;
    model: string;
    timeout: number;
}
export declare class OllamaUtil {
    private static readonly logger;
    private static client;
    private static readonly config;
    static initialize(): void;
    static generateResponse(prompt: string, context?: string, systemPrompt?: string): Promise<{
        response: string;
        model: string;
        totalDuration: number;
    }>;
    static healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        version?: string;
        models?: string[];
        error?: string;
    }>;
    static listModels(): Promise<string[]>;
    static setModel(modelName: string): void;
    static getConfig(): OllamaConfig;
    static testConnection(): Promise<boolean>;
}
