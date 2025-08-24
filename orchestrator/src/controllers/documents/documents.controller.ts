// src/controllers/documents.controller.ts
import { Controller, Post, Get, Delete, Body, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { IndexDocumentDto, IndexFromFileDto, IndexMultipleDocumentsDto } from 'src/dto/document.dto';
import { DocumentService } from 'src/services/document/document.service';
import { OllamaUtil } from 'src/utils/ollama.util';

@Controller('documents')
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(private readonly documentService: DocumentService) {}

  /**
   * POST /documents/index
   * Indexar un documento desde texto directo
   */
  @Post('index')
  @HttpCode(HttpStatus.OK)
  async indexDocument(@Body() dto: IndexDocumentDto) {
    try {
      this.logger.log(`Indexing document: ${dto.fileName}`);
      const result = await this.documentService.indexDocument(dto);
      
      return {
        success: true,
        message: `Document "${dto.fileName}" indexed successfully`,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error indexing document:', error);
      return {
        success: false,
        message: 'Error indexing document',
        error: error.message,
      };
    }
  }

  /**
   * POST /documents/index-multiple
   * Indexar múltiples documentos
   */
  @Post('index-multiple')
  @HttpCode(HttpStatus.OK)
  async indexMultipleDocuments(@Body() dto: IndexMultipleDocumentsDto) {
    try {
      this.logger.log(`Indexing ${dto.documents.length} documents`);
      const result = await this.documentService.indexMultipleDocuments(dto);
      
      return {
        success: true,
        message: `Batch indexing completed: ${result.documentsProcessed} documents processed`,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error in batch indexing:', error);
      return {
        success: false,
        message: 'Error in batch indexing',
        error: error.message,
      };
    }
  }

  /**
   * POST /documents/index-file
   * Indexar documento desde archivo
   */
  @Post('index-file')
  @HttpCode(HttpStatus.OK)
  async indexFromFile(@Body() dto: IndexFromFileDto) {
    try {
      this.logger.log(`Indexing file: ${dto.filePath}`);
      const result = await this.documentService.indexFromFile(dto);
      
      return {
        success: true,
        message: `File "${dto.filePath}" indexed successfully`,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error indexing file:', error);
      return {
        success: false,
        message: 'Error indexing file',
        error: error.message,
      };
    }
  }

  /**
   * POST /documents/index-directory
   * Indexar todos los archivos de una carpeta
   */
  @Post('index-directory')
  @HttpCode(HttpStatus.OK)
  async indexFromDirectory(@Body() body: { directoryPath: string; source?: string }) {
    try {
      this.logger.log(`Indexing directory: ${body.directoryPath}`);
      const result = await this.documentService.indexFromDirectory(
        body.directoryPath,
        body.source,
      );
      
      return {
        success: true,
        message: `Directory "${body.directoryPath}" indexed successfully`,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error indexing directory:', error);
      return {
        success: false,
        message: 'Error indexing directory',
        error: error.message,
      };
    }
  }

  /**
   * GET /documents/stats
   * Obtener estadísticas del índice
   */
  @Get('stats')
  async getIndexingStats() {
    try {
      const stats = await this.documentService.getIndexingStats();
      
      return {
        success: true,
        message: 'Statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      this.logger.error('Error getting stats:', error);
      return {
        success: false,
        message: 'Error getting statistics',
        error: error.message,
      };
    }
  }

  /**
   * DELETE /documents/clear
   * Limpiar todo el índice
   */
  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  async clearIndex() {
    try {
      this.logger.log('Clearing index...');
      const result = await this.documentService.clearIndex();
      
      return {
        success: true,
        message: 'Index cleared successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error clearing index:', error);
      return {
        success: false,
        message: 'Error clearing index',
        error: error.message,
      };
    }
  }

  /**
   * GET /documents/health
   * Health check para el servicio de documentos
   */
  @Get('health')
  async healthCheck() {
    try {
      const stats = await this.documentService.getIndexingStats();
      
      return {
        success: true,
        message: 'Document service is healthy',
        data: {
          status: 'healthy',
          totalVectors: stats.totalVectors,
          embeddingModel: stats.embeddingModel,
        },
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        success: false,
        message: 'Document service is unhealthy',
        error: error.message,
      };
    }
  }


  /**
   * GET /documents/ollama-health
   * Verificar conexión con Ollama
   */
  @Get('ollama-health')
  async ollamaHealthCheck() {
    try {
      const health = await OllamaUtil.healthCheck();
      
      return {
        success: health.status === 'healthy',
        message: health.status === 'healthy' ? 'Ollama connection is healthy' : 'Ollama connection failed',
        data: health,
      };
    } catch (error) {
      this.logger.error('Ollama health check failed:', error);
      return {
        success: false,
        message: 'Error checking Ollama health',
        error: error.message,
      };
    }
  }
}