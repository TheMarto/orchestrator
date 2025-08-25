import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingService } from '../embedding/embedding.service';
import { VectorService } from '../vector/vector.service';
import { OllamaUtil } from 'src/utils/ollama.util';
import { ChatResponse, RAGContext, VectorSearchResult } from 'src/interfaces/types';



@Injectable()
export class RagService {





  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorService: VectorService,
  ) {}

  /**
   * Procesar query completa RAG
   */
  async processQuery(
    query: string,
    maxResults: number = 5,
    minScore: number = 0.3, // Cambiar default aquí también
    model?: string,
  ): Promise<ChatResponse> {
    const startTime = Date.now();
    
    try {
      this.logger.log(`Processing RAG query: "${query.substring(0, 50)}..."`);

      // 1. Generar embedding de la query
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);
      this.logger.debug(`Query embedding generated`);

      // 2. Buscar vectores similares
      const similarChunks = await this.vectorService.searchSimilar(
        queryEmbedding,
        maxResults,
        minScore,
      );

      this.logger.log(`Found ${similarChunks.length} relevant chunks`);

      // 3. Construir contexto
      const context = this.buildContext(query, similarChunks);

      // 4. Generar respuesta con Ollama
      if (model) {
        OllamaUtil.setModel(model);
      }

      const ollamaResponse = await OllamaUtil.generateResponse(
        query,
        context.contextText,
        this.buildSystemPrompt(),
      );

      const processingTime = Date.now() - startTime;
      this.logger.log(`RAG query processed successfully in ${processingTime}ms`);

      return {
        response: ollamaResponse.response,
        sources: similarChunks,
        processingTime,
      };
    } catch (error) {
      this.logger.error(`Error processing RAG query:`, error);
      throw error;
    }
  }

  /**
   * Construir contexto para el LLM
   */
  private buildContext(query: string, chunks: VectorSearchResult[]): RAGContext {
    if (chunks.length === 0) {
      return {
        query,
        relevantChunks: [],
        contextText: 'No se encontraron documentos relevantes para responder esta pregunta.',
      };
    }

    // Ordenar por score descendente
    const sortedChunks = chunks.sort((a, b) => b.score - a.score);

    // Construir texto de contexto
    let contextText = 'Información relevante de los documentos:\n\n';
    
    sortedChunks.forEach((chunk, index) => {
      contextText += `[Documento ${index + 1}: ${chunk.payload.fileName}]\n`;
      contextText += `${chunk.payload.content}\n`;
      contextText += `(Relevancia: ${(chunk.score * 100).toFixed(1)}%)\n\n`;
    });

    return {
      query,
      relevantChunks: sortedChunks,
      contextText: contextText.trim(),
    };
  }

  /**
   * System prompt para el LLM
   */
  private buildSystemPrompt(): string {
    return `Eres un asistente especializado que responde preguntas basándose exclusivamente en los documentos proporcionados.

INSTRUCCIONES:
1. Responde SOLO basándote en la información del contexto proporcionado
2. Si la información no está en el contexto, di claramente "No tengo información suficiente en los documentos para responder esta pregunta"
3. Cita los documentos relevantes cuando sea apropiado
4. Sé preciso y conciso
5. Si hay información contradictoria en diferentes documentos, menciona las diferencias

FORMATO DE RESPUESTA:
- Respuesta clara y directa
- Menciona las fuentes cuando sea relevante
- Si usas información de múltiples documentos, organiza la respuesta de forma coherente`;
  }

  /**
   * Búsqueda simple (sin generar respuesta LLM)
   */
  async searchDocuments(
    query: string,
    maxResults: number = 5,
    minScore: number = 0.3, // Consistente con processQuery
  ): Promise<VectorSearchResult[]> {
    try {
      this.logger.log(`Searching documents for: "${query.substring(0, 50)}..."`);

      // Generar embedding de la query
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);

      // Buscar vectores similares
      const results = await this.vectorService.searchSimilar(
        queryEmbedding,
        maxResults,
        minScore,
      );

      this.logger.log(`Found ${results.length} matching documents`);
      return results;
    } catch (error) {
      this.logger.error('Error searching documents:', error);
      throw error;
    }
  }

  /**
   * Generar respuesta sin búsqueda (contexto manual)
   */
  async generateResponse(
    query: string,
    context: string,
    model?: string,
  ): Promise<{
    response: string;
    model: string;
    processingTime: number;
  }> {
    const startTime = Date.now();

    try {
      this.logger.log(`Generating response for query: "${query.substring(0, 50)}..."`);

      if (model) {
        OllamaUtil.setModel(model);
      }

      const result = await OllamaUtil.generateResponse(
        query,
        context,
        this.buildSystemPrompt(),
      );

      const processingTime = Date.now() - startTime;
      this.logger.log(`Response generated in ${processingTime}ms`);

      return {
        response: result.response,
        model: result.model,
        processingTime,
      };
    } catch (error) {
      this.logger.error('Error generating response:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del sistema RAG
   */
  async getRAGStats() {
    try {
      const vectorStats = await this.vectorService.getCollectionInfo();
      const embeddingInfo = this.embeddingService.getModelInfo();
      const ollamaConfig = OllamaUtil.getConfig();
      const ollamaHealth = await OllamaUtil.healthCheck();

      return {
        vectors: {
          totalDocuments: vectorStats.points_count || 0,
          collectionStatus: vectorStats.status || 'unknown',
        },
        embedding: {
          model: embeddingInfo.model,
          dimension: embeddingInfo.dimension,
          maxLength: embeddingInfo.maxLength,
        },
        llm: {
          host: `${ollamaConfig.host}:${ollamaConfig.port}`,
          model: ollamaConfig.model,
          status: ollamaHealth.status,
          availableModels: ollamaHealth.models || [],
        },
      };
    } catch (error) {
      this.logger.error('Error getting RAG stats:', error);
      throw error;
    }
  }
}
