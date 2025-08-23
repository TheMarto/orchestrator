// src/dto/document.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IndexDocumentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsOptional()
  @IsString()
  source?: string;
}

export class IndexMultipleDocumentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IndexDocumentDto)
  documents: IndexDocumentDto[];
}

export class IndexFromFileDto {
  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsOptional()
  @IsString()
  source?: string;
}