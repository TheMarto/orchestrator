import { Injectable } from '@nestjs/common';
import { DbConfig, IDBConnector, SupportedEngine } from '../../interfaces/db.types';

type ConnectorFactory = () => IDBConnector;

@Injectable()
export class DatabaseConnectionService {
  /** Fábricas por motor: 'mysql' | 'postgres' | 'sqlite' | 'mongo' */
  private factories = new Map<SupportedEngine, ConnectorFactory>();

  /** Conexiones activas por alias (p. ej., 'default', 'tenantA', ...) */
  private active = new Map<string, IDBConnector>();

  /** Registro de un motor (se suele hacer en el módulo, en onModuleInit) */
  registerEngine(engine: SupportedEngine, factory: ConnectorFactory) {
    this.factories.set(engine, factory);
  }

  /** Conectar una BBDD y guardarla bajo un alias */
  async connect(alias: string, config: DbConfig): Promise<void> { 
  const factory = this.factories.get(config.engine);
  if (!factory) throw new Error(`Engine not supported or not registered: ${config.engine}`);

  const connector = factory();
  await connector.connect(config);

  // 🔴 Verifica salud; si está mal, no guardes el alias
  const health = await connector.health();
  if (!health.ok) {
    await connector.disconnect();
    throw new Error(`DB health check failed: ${health.details?.error || 'unknown'}`);
  }

  this.active.set(alias, connector);
}


  /** Desconectar y liberar recursos */
  async disconnect(alias: string): Promise<void> {
    const conn = this.active.get(alias);
    if (!conn) return;
    await conn.disconnect();
    this.active.delete(alias);
  }

  /** Comprobar salud de una conexión */
  async health(alias: string): Promise<{ ok: boolean; details?: any }> {
    const conn = this.getOrThrow(alias);
    return conn.health();
  }

  /** Ejecutar una consulta (SQL o DSL/Pipeline) en el alias dado */
  async query<T = any>(alias: string, statementOrDsl: any, params?: any): Promise<T[]> {
    const conn = this.getOrThrow(alias);
    return conn.query<T>(statementOrDsl, params);
  }

  /** Obtener una conexión (por si algún servicio la necesita directamente) */
  get(alias: string): IDBConnector | undefined {
    return this.active.get(alias);
  }

  /** Listar alias activos (útil para debug) */
  listAliases(): string[] {
    return Array.from(this.active.keys());
  }

  /** Helper */
  private getOrThrow(alias: string): IDBConnector {
    const conn = this.active.get(alias);
    if (!conn) {
      throw new Error(`No active DB connection for alias: ${alias}`);
    }
    return conn;
  }
}
