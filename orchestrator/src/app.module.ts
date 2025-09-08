import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VectorService } from './services/vector/vector.service';
import { DocumentService } from './services/document/document.service';
import { EmbeddingService } from './services/embedding/embedding.service';
import { DocumentsController } from './controllers/documents/documents.controller';
import { ChatController } from './controllers/chat/chat.controller';
import { RagService } from './services/rag/rag.service';
import { OllamaProxyController } from './controllers/ollama-proxy/ollama-proxy.controller';
import { DatabaseModule } from './module/database.module';
import { DbController } from './controllers/db/db.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    DocumentsController,
    ChatController,
    OllamaProxyController,
    DbController
  ],
  providers: [
    AppService,
    EmbeddingService,
    VectorService,
    DocumentService,
    RagService

  ],
})
export class AppModule {}
