import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VectorService } from './services/vector/vector.service';
import { DocumentService } from './services/document/document.service';
import { EmbeddingService } from './services/embedding/embedding.service';
import { DocumentsController } from './controllers/documents/documents.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    DocumentsController
  ],
  providers: [
    AppService,
    EmbeddingService,
    VectorService,
    DocumentService,

  ],
})
export class AppModule {}
