import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { pipeline, FeatureExtractionPipeline, Pipeline } from '@xenova/transformers';
import { EmbeddingConfig } from 'src/interfaces/types';


@Injectable()
export class EmbeddingService implements OnModuleInit {






private readonly logger = new Logger(EmbeddingService.name);
  private embedder: any; // Usar any para evitar problemas de tipos con la librería
  
  private readonly config: EmbeddingConfig = {
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    maxLength: 512,
  };

  async onModuleInit() {
    try {
      this.logger.log('Loading embedding model...');
      this.embedder = await pipeline(
        'feature-extraction',
        this.config.model,
        { 
          quantized: false,  // Mejor calidad, más lento
        }
      );
      this.logger.log('Embedding model loaded successfully');
    } catch (error) {
      this.logger.error('Error loading embedding model:', error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Truncar texto si es muy largo
      const truncatedText = text.length > this.config.maxLength 
        ? text.substring(0, this.config.maxLength) 
        : text;

      // Generar embedding
      const output = await this.embedder(truncatedText, {
        pooling: 'mean',
        normalize: true,
      });

      // Extraer el array de números del tensor
      // Acceder a los datos del tensor de manera segura
      let embedding: number[];
      
      if (output && typeof output === 'object' && 'data' in output) {
        embedding = Array.from(output.data as Float32Array).map(x => Number(x));
      } else if (Array.isArray(output)) {
        embedding = output.map(x => Number(x));
      } else {
        throw new Error('Unexpected output format from embedding model');
      }
      
      return embedding;
    } catch (error) {
      this.logger.error('Error generating embedding:', error);
      throw error;
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      this.logger.log(`Generating embeddings for ${texts.length} texts`);
      
      // Procesar en lotes para evitar sobrecarga de memoria
      const batchSize = 10;
      const embeddings: number[][] = [];

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const batchPromises = batch.map(text => this.generateEmbedding(text));
        const batchEmbeddings = await Promise.all(batchPromises);
        embeddings.push(...batchEmbeddings);
        
        this.logger.log(`Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(texts.length/batchSize)}`);
      }

      return embeddings;
    } catch (error) {
      this.logger.error('Error generating batch embeddings:', error);
      throw error;
    }
  }

  getEmbeddingDimension(): number {
    return 384; // all-MiniLM-L6-v2 produces 384-dimensional embeddings
  }

  getModelInfo() {
    return {
      model: this.config.model,
      maxLength: this.config.maxLength,
      dimension: this.getEmbeddingDimension(),
    };
  }

}
