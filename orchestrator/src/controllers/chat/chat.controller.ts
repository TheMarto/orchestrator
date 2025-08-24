import { Controller, Post, Get, Body, Logger, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { ChatQueryDto } from 'src/dto/chat.dto';
import { RagService } from 'src/services/rag/rag.service';

@Controller('chat')
export class ChatController {


    private readonly logger = new Logger(ChatController.name);

  constructor(private readonly ragService: RagService) {}

  /**
   * POST /chat/query
   * Query principal RAG - busca + genera respuesta
   */
  @Post('query')
  @HttpCode(HttpStatus.OK)
  async query(@Body() dto: ChatQueryDto) {
    try {
      this.logger.log(`Processing RAG query: "${dto.query.substring(0, 50)}..."`);
      
      const result = await this.ragService.processQuery(
        dto.query,
        dto.maxResults,
        dto.minScore,
      );
      
      return {
        success: true,
        message: 'Query processed successfully',
        data: {
          query: dto.query,
          response: result.response,
          sources: result.sources.map(source => ({
            fileName: source.payload.fileName,
            content: source.payload.content.substring(0, 200) + '...',
            relevance: Math.round(source.score * 100),
            source: source.payload.source,
          })),
          processingTime: result.processingTime,
          sourceCount: result.sources.length,
        },
      };
    } catch (error) {
      this.logger.error('Error processing query:', error);
      return {
        success: false,
        message: 'Error processing query',
        error: error.message,
      };
    }
  }

  /**
   * POST /chat/search
   * Solo búsqueda (sin generar respuesta)
   */
  @Post('search')
  @HttpCode(HttpStatus.OK)
  async searchOnly(@Body() dto: ChatQueryDto) {
    try {
      this.logger.log(`Searching for: "${dto.query.substring(0, 50)}..."`);
      
      const results = await this.ragService.searchDocuments(
        dto.query,
        dto.maxResults,
        dto.minScore,
      );
      
      return {
        success: true,
        message: `Found ${results.length} relevant documents`,
        data: {
          query: dto.query,
          results: results.map(result => ({
            fileName: result.payload.fileName,
            content: result.payload.content,
            relevance: Math.round(result.score * 100),
            source: result.payload.source,
            chunkIndex: result.payload.chunkIndex,
          })),
          resultCount: results.length,
        },
      };
    } catch (error) {
      this.logger.error('Error searching documents:', error);
      return {
        success: false,
        message: 'Error searching documents',
        error: error.message,
      };
    }
  }

  /**
   * POST /chat/generate
   * Solo generar respuesta (con contexto manual)
   */
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateOnly(@Body() body: { query: string; context: string; model?: string }) {
    try {
      this.logger.log(`Generating response for: "${body.query.substring(0, 50)}..."`);
      
      const result = await this.ragService.generateResponse(
        body.query,
        body.context,
        body.model,
      );
      
      return {
        success: true,
        message: 'Response generated successfully',
        data: {
          query: body.query,
          response: result.response,
          model: result.model,
          processingTime: result.processingTime,
        },
      };
    } catch (error) {
      this.logger.error('Error generating response:', error);
      return {
        success: false,
        message: 'Error generating response',
        error: error.message,
      };
    }
  }

  /**
   * GET /chat/stats
   * Estadísticas del sistema RAG
   */
  @Get('stats')
  async getStats() {
    try {
      const stats = await this.ragService.getRAGStats();
      
      return {
        success: true,
        message: 'RAG statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      this.logger.error('Error getting RAG stats:', error);
      return {
        success: false,
        message: 'Error getting RAG statistics',
        error: error.message,
      };
    }
  }

  /**
   * GET /chat/health
   * Health check del sistema completo RAG
   */
  @Get('health')
  async healthCheck() {
    try {
      const stats = await this.ragService.getRAGStats();
      
      const isHealthy = 
        stats.vectors.collectionStatus === 'green' && 
        stats.llm.status === 'healthy';
      
      return {
        success: isHealthy,
        message: isHealthy ? 'RAG system is healthy' : 'RAG system has issues',
        data: {
          status: isHealthy ? 'healthy' : 'unhealthy',
          components: {
            vectorDB: stats.vectors.collectionStatus === 'green' ? 'healthy' : 'unhealthy',
            llm: stats.llm.status === 'healthy' ? 'healthy' : 'unhealthy',
            embedding: 'healthy', // Si llegamos aquí, funciona
          },
          summary: {
            totalDocuments: stats.vectors.totalDocuments,
            embeddingModel: stats.embedding.model,
            llmModel: stats.llm.model,
            availableModels: stats.llm.availableModels.length,
          },
        },
      };
    } catch (error) {
      this.logger.error('RAG health check failed:', error);
      return {
        success: false,
        message: 'RAG health check failed',
        error: error.message,
      };
    }
  }
}
