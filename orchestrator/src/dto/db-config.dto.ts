// src/dto/db-config.dto.ts
import {
  IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export const SUPPORTED_ENGINES = ['mysql', 'postgres', 'sqlite', 'mongo'] as const;

export class DbConfigDto {
  @IsIn(SUPPORTED_ENGINES as readonly string[])
  engine!: string;

  @ValidateIf(o => o.engine === 'mysql' || o.engine === 'postgres')
  @IsString() @IsNotEmpty()
  host?: string;

  @ValidateIf(o => o.engine === 'mysql' || o.engine === 'postgres')
  @IsNumber()
  port?: number;

  @ValidateIf(o => o.engine === 'mysql' || o.engine === 'postgres')
  @IsString() @IsNotEmpty()
  database?: string;

  @ValidateIf(o => o.engine === 'mysql' || o.engine === 'postgres')
  @IsString() @IsNotEmpty()
  user?: string;

  @ValidateIf(o => o.engine === 'mysql' || o.engine === 'postgres')
  @IsString() @IsNotEmpty()
  password?: string;

  @ValidateIf(o => o.engine === 'mysql' || o.engine === 'postgres')
  @IsOptional() @IsBoolean()
  ssl?: boolean;

  // SQLite
  @ValidateIf(o => o.engine === 'sqlite')
  @IsString() @IsNotEmpty()
  file?: string;

  // Mongo
  @ValidateIf(o => o.engine === 'mongo')
  @IsString() @IsNotEmpty()
  uri?: string;

  @ValidateIf(o => o.engine === 'mongo')
  @IsOptional()
  options?: Record<string, any>;
}

/** ⬇️ ESTA ES LA QUE FALTABA EXPORTAR */
export class DbConnectPayloadDto {
  @IsString()
  @IsOptional()
  alias?: string = 'default';

  @ValidateNested()
  @Type(() => DbConfigDto)
  config!: DbConfigDto;
}
