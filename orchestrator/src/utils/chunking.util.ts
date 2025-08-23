// src/utils/chunking.util.ts
import { DocumentChunk, ChunkMetadata, ChunkingConfig } from '../interfaces/types';
import { v4 as uuidv4 } from 'uuid';

export class ChunkingUtil {
  private static readonly config: ChunkingConfig = {
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ['\n\n', '\n', '. ', '! ', '? ', '; ', ' '],
  };

  static chunkDocument(
    content: string,
    fileName: string,
    source: string = 'upload',
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const cleanContent = this.cleanText(content);
    
    if (cleanContent.length <= this.config.chunkSize) {
      // Si el documento es pequeño, crear un solo chunk
      const chunk: DocumentChunk = {
        id: uuidv4(),
        content: cleanContent,
        metadata: {
          source,
          fileName,
          chunkIndex: 0,
          totalChunks: 1,
          charCount: cleanContent.length,
          timestamp: new Date(),
        },
      };
      return [chunk];
    }

    // Chunking inteligente
    const textChunks = this.smartSplit(cleanContent);
    
    textChunks.forEach((chunkContent, index) => {
      const chunk: DocumentChunk = {
        id: uuidv4(),
        content: chunkContent.trim(),
        metadata: {
          source,
          fileName,
          chunkIndex: index,
          totalChunks: textChunks.length,
          charCount: chunkContent.length,
          timestamp: new Date(),
        },
      };
      chunks.push(chunk);
    });

    return chunks;
  }

  private static cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')  // Normalizar saltos de línea
      .replace(/\t/g, ' ')     // Convertir tabs a espacios
      .replace(/\s+/g, ' ')    // Múltiples espacios a uno solo
      .trim();
  }

  private static smartSplit(text: string): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    
    const sentences = this.splitBySeparators(text);
    
    for (const sentence of sentences) {
      // Si la oración es muy larga, dividirla
      if (sentence.length > this.config.chunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = '';
        }
        
        // Dividir oración larga en pedazos
        const sentenceParts = this.splitLongSentence(sentence);
        chunks.push(...sentenceParts);
        continue;
      }
      
      // Si agregar esta oración excede el tamaño del chunk
      if (currentChunk.length + sentence.length > this.config.chunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk);
          
          // Comenzar nuevo chunk con overlap
          const overlap = this.getOverlapText(currentChunk);
          currentChunk = overlap + sentence;
        } else {
          currentChunk = sentence;
        }
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks.filter(chunk => chunk.trim().length > 0);
  }

  private static splitBySeparators(text: string): string[] {
    let sentences = [text];
    
    for (const separator of this.config.separators) {
      const newSentences: string[] = [];
      
      for (const sentence of sentences) {
        const parts = sentence.split(separator);
        newSentences.push(...parts.filter(part => part.trim().length > 0));
      }
      
      sentences = newSentences;
    }
    
    return sentences;
  }

  private static splitLongSentence(sentence: string): string[] {
    const parts: string[] = [];
    const words = sentence.split(' ');
    let currentPart = '';
    
    for (const word of words) {
      if (currentPart.length + word.length + 1 <= this.config.chunkSize) {
        currentPart += (currentPart ? ' ' : '') + word;
      } else {
        if (currentPart) {
          parts.push(currentPart);
        }
        currentPart = word;
      }
    }
    
    if (currentPart) {
      parts.push(currentPart);
    }
    
    return parts;
  }

  private static getOverlapText(text: string): string {
    if (text.length <= this.config.chunkOverlap) {
      return text + ' ';
    }
    
    const words = text.split(' ');
    let overlap = '';
    
    for (let i = words.length - 1; i >= 0; i--) {
      const potentialOverlap = words.slice(i).join(' ');
      if (potentialOverlap.length <= this.config.chunkOverlap) {
        overlap = potentialOverlap + ' ';
        break;
      }
    }
    
    return overlap;
  }
}