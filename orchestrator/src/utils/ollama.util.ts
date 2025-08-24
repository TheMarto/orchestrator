// src/utils/ollama.util.ts
import axios, { AxiosInstance } from 'axios';
import { Logger } from '@nestjs/common';
import { OllamaResponse } from '../interfaces/types';

export interface OllamaConfig {
  host: string;
  port: number;
  model: string;
  timeout: number;
}

export class OllamaUtil {
  private static readonly logger = new Logger(OllamaUtil.name);
  private static client: AxiosInstance;
  
  // 🔧 IP configurable - cambiar aquí si migras de red
  private static readonly config: OllamaConfig = {
    host: '10.10.10.198',  // IP de tu server i5
    port: 11434,           // Puerto por defecto de Ollama
    model: 'llama3.1:8b',  // Tienes este modelo disponible
    timeout: 120000,       // 2 minutos timeout
  };

  static initialize() {
    this.client = axios.create({
      baseURL: `http://${this.config.host}:${this.config.port}`,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.log(`OllamaUtil initialized - ${this.config.host}:${this.config.port}`);
  }

  /**
   * Generar respuesta usando Ollama
   */
  static async generateResponse(
    prompt: string,
    context?: string,
    systemPrompt?: string,
  ): Promise<{
    response: string;
    model: string;
    totalDuration: number;
  }> {
    try {
      if (!this.client) {
        this.initialize();
      }

      // Construir prompt completo
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
      const data: OllamaResponse = response.data;

      this.logger.log(`Ollama response generated successfully (${data.total_duration}ms)`);

      return {
        response: data.response,
        model: this.config.model,
        totalDuration: data.total_duration || 0,
      };
    } catch (error) {
      this.logger.error('Error generating response with Ollama:', error);
      
      if (axios.isAxiosError(error)) {
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

  /**
   * Verificar que Ollama esté disponible
   */
  static async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    version?: string;
    models?: string[];
    error?: string;
  }> {
    try {
      if (!this.client) {
        this.initialize();
      }

      // Verificar versión de Ollama
      const versionResponse = await this.client.get('/api/version');
      
      // Listar modelos disponibles
      const modelsResponse = await this.client.get('/api/tags');
      const models = modelsResponse.data.models?.map((m: any) => m.name) || [];

      return {
        status: 'healthy',
        version: versionResponse.data.version,
        models: models,
      };
    } catch (error) {
      this.logger.error('Ollama health check failed:', error);
      
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Listar modelos disponibles en Ollama
   */
  static async listModels(): Promise<string[]> {
    try {
      if (!this.client) {
        this.initialize();
      }

      const response = await this.client.get('/api/tags');
      return response.data.models?.map((m: any) => m.name) || [];
    } catch (error) {
      this.logger.error('Error listing models:', error);
      throw error;
    }
  }

  /**
   * Cambiar modelo activo
   */
  static setModel(modelName: string) {
    this.config.model = modelName;
    this.logger.log(`Model changed to: ${modelName}`);
  }

  /**
   * Obtener configuración actual
   */
  static getConfig(): OllamaConfig {
    return { ...this.config };
  }

  /**
   * Test rápido de conexión
   */
  static async testConnection(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status === 'healthy';
    } catch {
      return false;
    }
  }
}