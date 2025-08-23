import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { DocumentChunk, QdrantConfig, VectorSearchResult } from 'src/interfaces/types';


@Injectable()
export class VectorService implements OnModuleInit{
private readonly logger = new Logger(VectorService.name);
  private client: QdrantClient;
  private readonly collectionName = 'documents_rag';
  
  private readonly config: QdrantConfig = {
    host: '10.10.10.102',  // Tu IP de Qdrant
    port: 6333,
  };

  async onModuleInit() {
    this.client = new QdrantClient({
      url: `http://${this.config.host}:${this.config.port}`,
    });

    await this.ensureCollection();
    this.logger.log('VectorService initialized and connected to Qdrant');
  }

  private async ensureCollection() {
    try {
      // Verificar si la colección existe
      const collections = await this.client.getCollections();
      const collectionExists = collections.collections.some(
        (col) => col.name === this.collectionName,
      );

      if (!collectionExists) {
        // Crear colección si no existe
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: 384, // Tamaño para all-MiniLM-L6-v2
            distance: 'Cosine',
          },
        });
        this.logger.log(`Collection '${this.collectionName}' created`);
      } else {
        this.logger.log(`Collection '${this.collectionName}' already exists`);
      }
    } catch (error) {
      this.logger.error('Error ensuring collection exists:', error);
      throw error;
    }
  }

  async indexChunks(chunks: DocumentChunk[]): Promise<void> {
    try {
      // Filtrar chunks que tienen embeddings válidos
      const validChunks = chunks.filter(chunk => chunk.embedding && chunk.embedding.length > 0);
      
      if (validChunks.length === 0) {
        throw new Error('No valid chunks with embeddings to index');
      }

      const points = validChunks.map((chunk) => ({
        id: chunk.id,
        vector: chunk.embedding!, // Usamos ! porque ya verificamos que existe
        payload: {
          content: chunk.content,
          ...chunk.metadata,
        },
      }));

      await this.client.upsert(this.collectionName, {
        wait: true,
        points: points,
      });

      this.logger.log(`Indexed ${validChunks.length} chunks successfully`);
    } catch (error) {
      this.logger.error('Error indexing chunks:', error);
      throw error;
    }
  }

  async searchSimilar(
    queryEmbedding: number[],
    limit: number = 5,
    scoreThreshold: number = 0.7,
  ): Promise<VectorSearchResult[]> {
    try {
      const searchResult = await this.client.search(this.collectionName, {
        vector: queryEmbedding,
        limit: limit,
        score_threshold: scoreThreshold,
        with_payload: true,
      });

      return searchResult.map((result) => {
        // Validar y asegurar que el payload tiene la estructura correcta
        const payload = result.payload as Record<string, any>;
        
        if (!payload || typeof payload !== 'object') {
          throw new Error('Invalid payload structure in search result');
        }

        return {
          id: result.id.toString(),
          score: result.score,
          payload: {
            content: payload.content as string,
            source: payload.source as string,
            fileName: payload.fileName as string,
            chunkIndex: payload.chunkIndex as number,
            totalChunks: payload.totalChunks as number,
            charCount: payload.charCount as number,
            timestamp: new Date(payload.timestamp),
          },
        };
      });
    } catch (error) {
      this.logger.error('Error searching vectors:', error);
      throw error;
    }
  }

  async deleteCollection(): Promise<void> {
    try {
      await this.client.deleteCollection(this.collectionName);
      this.logger.log(`Collection '${this.collectionName}' deleted`);
    } catch (error) {
      this.logger.error('Error deleting collection:', error);
      throw error;
    }
  }

  async getCollectionInfo() {
    try {
      return await this.client.getCollection(this.collectionName);
    } catch (error) {
      this.logger.error('Error getting collection info:', error);
      throw error;
    }
  }
}
