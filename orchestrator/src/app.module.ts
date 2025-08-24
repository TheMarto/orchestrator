import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VectorService } from './services/vector/vector.service';
import { DocumentService } from './services/document/document.service';
import { EmbeddingService } from './services/embedding/embedding.service';
import { DocumentsController } from './controllers/documents/documents.controller';
import { ChatController } from './controllers/chat/chat.controller';
import { RagService } from './services/rag/rag.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    DocumentsController,
    ChatController
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
