// src/services/document.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { EmbeddingService } from '../embedding/embedding.service';
import { VectorService } from '../vector/vector.service';
import { IndexDocumentDto, IndexFromFileDto, IndexMultipleDocumentsDto } from 'src/dto/document.dto';
import { ChunkingUtil } from 'src/utils/chunking.util';
import { DocumentChunk } from 'src/interfaces/types';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorService: VectorService,
  ) {}

  /**
   * Indexar un documento desde texto directo
   */
  async indexDocument(dto: IndexDocumentDto): Promise<{
    success: boolean;
    chunksCreated: number;
    fileName: string;
  }> {
    try {
      this.logger.log(`Starting indexation of document: ${dto.fileName}`);

      // 1. Chunking del documento
      const chunks = ChunkingUtil.chunkDocument(
        dto.content,
        dto.fileName,
        dto.source || 'direct_upload',
      );

      this.logger.log(`Document chunked into ${chunks.length} parts`);

      // 2. Generar embeddings para todos los chunks
      const contents = chunks.map(chunk => chunk.content);
      const embeddings = await this.embeddingService.generateEmbeddings(contents);

      // 3. Asignar embeddings a chunks
      const chunksWithEmbeddings: DocumentChunk[] = chunks.map((chunk, index) => ({
        ...chunk,
        embedding: embeddings[index],
      }));

      // 4. Indexar en Qdrant
      await this.vectorService.indexChunks(chunksWithEmbeddings);

      this.logger.log(`Document ${dto.fileName} indexed successfully`);

      return {
        success: true,
        chunksCreated: chunks.length,
        fileName: dto.fileName,
      };
    } catch (error) {
      this.logger.error(`Error indexing document ${dto.fileName}:`, error);
      throw error;
    }
  }

  /**
   * Indexar múltiples documentos
   */
  async indexMultipleDocuments(dto: IndexMultipleDocumentsDto): Promise<{
    success: boolean;
    documentsProcessed: number;
    totalChunks: number;
    results: Array<{
      fileName: string;
      chunksCreated: number;
      success: boolean;
      error?: string;
    }>;
  }> {
    try {
      this.logger.log(`Starting batch indexation of ${dto.documents.length} documents`);

      // Declarar explícitamente el tipo del array results
      const results: Array<{
        fileName: string;
        chunksCreated: number;
        success: boolean;
        error?: string;
      }> = [];
      
      let totalChunks = 0;
      let successCount = 0;

      for (const doc of dto.documents) {
        try {
          const result = await this.indexDocument(doc);
          results.push({
            fileName: doc.fileName,
            chunksCreated: result.chunksCreated,
            success: true,
          });
          totalChunks += result.chunksCreated;
          successCount++;
        } catch (error) {
          this.logger.error(`Failed to index document ${doc.fileName}:`, error);
          results.push({
            fileName: doc.fileName,
            chunksCreated: 0,
            success: false,
            error: error.message,
          });
        }
      }

      this.logger.log(`Batch indexation completed: ${successCount}/${dto.documents.length} successful`);

      return {
        success: successCount > 0,
        documentsProcessed: successCount,
        totalChunks,
        results,
      };
    } catch (error) {
      this.logger.error('Error in batch indexation:', error);
      throw error;
    }
  }

  /**
   * Indexar documento desde archivo
   */
  async indexFromFile(dto: IndexFromFileDto): Promise<{
    success: boolean;
    chunksCreated: number;
    fileName: string;
  }> {
    try {
      this.logger.log(`Reading file: ${dto.filePath}`);

      // Verificar que el archivo existe
      const fileExists = await this.fileExists(dto.filePath);
      if (!fileExists) {
        throw new Error(`File not found: ${dto.filePath}`);
      }

      // Leer contenido del archivo
      const content = await fs.readFile(dto.filePath, 'utf-8');
      const fileName = path.basename(dto.filePath);

      // Indexar usando el método de documento directo
      return await this.indexDocument({
        content,
        fileName,
        source: dto.source || 'file_upload',
      });
    } catch (error) {
      this.logger.error(`Error reading file ${dto.filePath}:`, error);
      throw error;
    }
  }

  /**
   * Indexar todos los archivos de una carpeta
   */
  async indexFromDirectory(directoryPath: string, source?: string): Promise<{
    success: boolean;
    documentsProcessed: number;
    totalChunks: number;
    results: Array<{
      fileName: string;
      chunksCreated: number;
      success: boolean;
      error?: string;
    }>;
  }> {
    try {
      this.logger.log(`Scanning directory: ${directoryPath}`);

      // Leer archivos de la carpeta
      const files = await fs.readdir(directoryPath);
      const textFiles = files.filter(file => 
        file.endsWith('.txt') || 
        file.endsWith('.md') || 
        file.endsWith('.text')
      );

      if (textFiles.length === 0) {
        this.logger.warn(`No text files found in directory: ${directoryPath}`);
        return {
          success: false,
          documentsProcessed: 0,
          totalChunks: 0,
          results: [],
        };
      }

      this.logger.log(`Found ${textFiles.length} text files to index`);

      const documents: IndexDocumentDto[] = [];

      // Leer todos los archivos
      for (const file of textFiles) {
        try {
          const filePath = path.join(directoryPath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          
          documents.push({
            content,
            fileName: file,
            source: source || 'directory_scan',
          });
        } catch (error) {
          this.logger.error(`Error reading file ${file}:`, error);
        }
      }

      // Indexar todos los documentos
      return await this.indexMultipleDocuments({ documents });
    } catch (error) {
      this.logger.error(`Error scanning directory ${directoryPath}:`, error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de indexación
   */
  async getIndexingStats() {
    try {
      const collectionInfo = await this.vectorService.getCollectionInfo();
      const embeddingInfo = this.embeddingService.getModelInfo();

      return {
        totalVectors: collectionInfo.vectors_count || 0,
        embeddingModel: embeddingInfo.model,
        embeddingDimension: embeddingInfo.dimension,
        maxTextLength: embeddingInfo.maxLength,
        collectionStatus: collectionInfo.status,
      };
    } catch (error) {
      this.logger.error('Error getting indexing stats:', error);
      throw error;
    }
  }

  /**
   * Limpiar todos los documentos indexados
   */
  async clearIndex(): Promise<{ success: boolean; message: string }> {
    try {
      await this.vectorService.deleteCollection();
      this.logger.log('Index cleared successfully');
      
      return {
        success: true,
        message: 'Index cleared successfully',
      };
    } catch (error) {
      this.logger.error('Error clearing index:', error);
      throw error;
    }
  }

  /**
   * Utilidad para verificar si un archivo existe
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}