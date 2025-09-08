import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, Max } from 'class-validator';
import { HybridStrategy } from '../interfaces/hybrid.types';

export const HYBRID_STRATEGIES = ['CONDITIONAL', 'PARALLEL', 'SEQUENTIAL'] as const;

export class HybridQueryDto {
  @IsString() @IsNotEmpty() @MaxLength(2000)
  text: string;

  @IsString() @IsOptional()
  alias?: string = 'default';

  @IsOptional()
  @IsIn(HYBRID_STRATEGIES as readonly string[])
  strategy?: string;

  @IsOptional() @IsBoolean()
  onlyDb?: boolean;

  @IsOptional() @IsBoolean()
  onlyRag?: boolean;

  @IsOptional() @IsNumber() @Min(200) @Max(5000)
  latencyBudgetMs?: number;

  @IsOptional() @IsNumber() @Min(1) @Max(20)
  maxResults?: number = 5;

  @IsOptional() @IsNumber() @Min(0) @Max(1)
  minScore?: number = 0.7;
}
