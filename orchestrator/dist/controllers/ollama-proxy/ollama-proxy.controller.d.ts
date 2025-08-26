import { RagService } from 'src/services/rag/rag.service';
export declare class OllamaProxyController {
    private readonly ragService;
    private readonly logger;
    constructor(ragService: RagService);
    generate(body: any): Promise<{
        model: any;
        created_at: string;
        response: string;
        done: boolean;
        context: string[];
        total_duration: number;
        load_duration: number;
        prompt_eval_count: any;
        prompt_eval_duration: number;
        eval_count: number;
        eval_duration: number;
    } | {
        model: any;
        created_at: string;
        response: string;
        done: boolean;
        error: any;
    }>;
    chat(body: any, req: any): Promise<{
        model: any;
        created_at: string;
        message: {
            role: string;
            content: string;
        };
        done: boolean;
        total_duration: number;
        load_duration: number;
        prompt_eval_count: any;
        prompt_eval_duration: number;
        eval_count: number;
        eval_duration: number;
    } | {
        model: any;
        created_at: string;
        response: string;
        done: boolean;
        context: string[];
        total_duration: number;
        load_duration: number;
        prompt_eval_count: any;
        prompt_eval_duration: number;
        eval_count: number;
        eval_duration: number;
    } | {
        model: any;
        created_at: string;
        response: string;
        done: boolean;
        total_duration: number;
        error?: undefined;
    } | {
        model: any;
        created_at: string;
        response: string;
        done: boolean;
        error: any;
        total_duration?: undefined;
    }>;
    chatCompleted(body: any): Promise<{
        status: string;
    }>;
    chatCompletions(body: any, req: any): Promise<{
        model: any;
        created_at: string;
        response: string;
        done: boolean;
        context: string[];
        total_duration: number;
        load_duration: number;
        prompt_eval_count: any;
        prompt_eval_duration: number;
        eval_count: number;
        eval_duration: number;
    } | {
        model: any;
        created_at: string;
        response: string;
        done: boolean;
        error: any;
    }>;
    listModels(): Promise<{
        models: {
            name: string;
            model: string;
            size: number;
            digest: string;
            details: {
                format: string;
                family: string;
            };
            modified_at: string;
        }[];
    }>;
    getVersion(): Promise<{
        version: string;
    }>;
    debugCatchAll(body: any, req: any): Promise<{
        message: string;
        method: any;
        url: any;
        path: any;
        body: any;
    }>;
}
