// src/interfaces/hybrid.types.ts

export type HybridStrategy = 'CONDITIONAL' | 'PARALLEL' | 'SEQUENTIAL';

export type EntityType =
  | 'product'
  | 'client'
  | 'ticket'
  | 'user'
  | 'group'
  | 'organization'
  | 'date'
  | 'email'
  | 'id'
  | 'free';

export interface EntityHit {
  type: EntityType;
  value: string;
  confidence: number; // 0..1
}

export interface PlannerInput {
  text: string;
  entities: EntityHit[];
  session?: Record<string, any>; // cliente/tenant/moneda/rol…
}

export interface PlanStep {
  source: 'db' | 'rag';
  purpose: string;      // p.ej. "obtener usuario por email", "manual de colores"
  spec: any;            // lo que la fuente necesita (consulta/pipeline/colección)
  required?: boolean;   // si falta info crítica → se debe preguntar
}

export interface Plan {
  strategy: HybridStrategy;
  steps: PlanStep[];
  needDisambiguation?: string[]; // “falta cliente”, “varios Martín…”
  latencyBudgetMs?: number;      // para paralelo (p.ej. 1200)
}

export interface SourceResult {
  source: 'db' | 'rag';
  score?: number;   // similitud/precisión si aplica
  data: any;        // filas DB o pasajes/resultados RAG
  trace?: any;      // metadatos: colección, consulta, tiempos…
}

export interface HybridResult {
  items: SourceResult[];
  explanation: string; // breve “cómo llegué a esto”
}

