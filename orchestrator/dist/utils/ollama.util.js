"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaUtil = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("@nestjs/common");
class OllamaUtil {
    static logger = new common_1.Logger(OllamaUtil.name);
    static client;
    static config = {
        host: '10.10.10.198',
        port: 11434,
        model: 'llama3.1:8b',
        timeout: 120000,
    };
    static initialize() {
        this.client = axios_1.default.create({
            baseURL: `http://${this.config.host}:${this.config.port}`,
            timeout: this.config.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.logger.log(`OllamaUtil initialized - ${this.config.host}:${this.config.port}`);
    }
    static async generateResponse(prompt, context, systemPrompt) {
        try {
            if (!this.client) {
                this.initialize();
            }
            let fullPrompt = prompt;
            if (context) {
                fullPrompt = `Contexto relevante de los documentos:
${context}

Pregunta del usuario: ${prompt}

Responde basándote en el contexto proporcionado. Si la información no está en el contexto, indícalo claramente.`;
            }
            const requestBody = {
                model: this.config.model,
                prompt: fullPrompt,
                system: systemPrompt || 'Eres un asistente especializado que responde preguntas basándose en documentos proporcionados. Sé preciso y cita información relevante.',
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    top_k: 40,
                },
            };
            this.logger.debug(`Sending request to Ollama: ${this.config.model}`);
            const response = await this.client.post('/api/generate', requestBody);
            const data = response.data;
            this.logger.log(`Ollama response generated successfully (${data.total_duration}ms)`);
            return {
                response: data.response,
                model: this.config.model,
                totalDuration: data.total_duration || 0,
            };
        }
        catch (error) {
            this.logger.error('Error generating response with Ollama:', error);
            if (axios_1.default.isAxiosError(error)) {
                if (error.code === 'ECONNREFUSED') {
                    throw new Error(`Cannot connect to Ollama at ${this.config.host}:${this.config.port}. Is Ollama running?`);
                }
                if (error.response?.status === 404) {
                    throw new Error(`Model '${this.config.model}' not found in Ollama. Available models can be checked with 'ollama list'`);
                }
            }
            throw error;
        }
    }
    static async healthCheck() {
        try {
            if (!this.client) {
                this.initialize();
            }
            const versionResponse = await this.client.get('/api/version');
            const modelsResponse = await this.client.get('/api/tags');
            const models = modelsResponse.data.models?.map((m) => m.name) || [];
            return {
                status: 'healthy',
                version: versionResponse.data.version,
                models: models,
            };
        }
        catch (error) {
            this.logger.error('Ollama health check failed:', error);
            return {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    static async listModels() {
        try {
            if (!this.client) {
                this.initialize();
            }
            const response = await this.client.get('/api/tags');
            return response.data.models?.map((m) => m.name) || [];
        }
        catch (error) {
            this.logger.error('Error listing models:', error);
            throw error;
        }
    }
    static setModel(modelName) {
        this.config.model = modelName;
        this.logger.log(`Model changed to: ${modelName}`);
    }
    static getConfig() {
        return { ...this.config };
    }
    static async testConnection() {
        try {
            const health = await this.healthCheck();
            return health.status === 'healthy';
        }
        catch {
            return false;
        }
    }
}
exports.OllamaUtil = OllamaUtil;
//# sourceMappingURL=ollama.util.js.map