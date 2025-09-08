// src/interfaces/db.types.ts

export type SupportedEngine = 'mysql' | 'postgres' | 'sqlite' | 'mongo';

export interface DbConfig {
  engine: SupportedEngine;

  // SQL (mysql/postgres)
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean;

  // SQLite
  file?: string;   // ruta a .sqlite

  // Mongo
  uri?: string;    // mongodb://...
  options?: Record<string, any>;
}

export interface IDBConnector {
  readonly engine: SupportedEngine;

  connect(config: DbConfig): Promise<void>;
  disconnect(): Promise<void>;

  // útil para /db/health
  health(): Promise<{ ok: boolean; details?: any }>;

  /**
   * SQL: statement parametrizado.
   * Mongo: pipeline/DSL (array de stages o filtro + opciones).
   */
  query<T = any>(statementOrDsl: any, params?: any): Promise<T[]>;
}

/* ---------- Catálogo semántico (descubierto por introspección) ---------- */

export interface SemanticField {
  name: string;                 // nombre “semántico” (price, email, status…)
  physicalPath: string;         // tabla.campo (SQL) o coleccion.ruta (Mongo)
  type: string;                 // string | number | date | objectId | boolean | array | object
  pii?: boolean;                // datos sensibles (correo, teléfono, etc.)
  synonyms?: string[];          // “oferta” ~ “promocion”, etc.
  examples?: string[];          // pequeños ejemplos anonimizados
  quality?: {                   // pequeñas métricas útiles
    nullPct?: number;
    distinctPct?: number;
  };
}

export interface Relationship {
  from: string;                 // entidad origen (nombre semántico)
  to: string;                   // entidad destino
  kind: 'fk' | 'ref' | 'inferred';
  via?: string[];               // ruta física (joins/lookup)
}

export interface SemanticEntity {
  name: string;                 // Producto, Usuario, Ticket…
  physicalName: string;         // tabla/colección principal
  synonyms?: string[];
  fields: SemanticField[];
  relationships?: Relationship[];
  notes?: string;               // hallazgos/limitaciones/convenciones
}

export interface SemanticCatalog {
  engine: SupportedEngine;
  database?: string;
  entities: SemanticEntity[];
  generatedAt: string;          // ISO date
}

