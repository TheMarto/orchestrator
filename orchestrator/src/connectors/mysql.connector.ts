import { IDBConnector, DbConfig, SupportedEngine } from 'src/interfaces/db.types';

type MysqlPool = any;

export class MySQLConnector implements IDBConnector {
  public readonly engine: SupportedEngine = 'mysql';

  private pool: MysqlPool | null = null;

  /** Carga dinámica para evitar problemas ESM/CJS */
  private async loadMysql() {
    try {
      // mysql2/promise soporta ESM; usamos import dinámico para evitar require() de CJS
      const mod = await import('mysql2/promise');
      return mod;
    } catch (err) {
      throw new Error(
        'Missing dependency "mysql2". Instala con: npm install mysql2\n' +
        `Detalle: ${(err as Error).message}`,
      );
    }
  }

  async connect(config: DbConfig): Promise<void> {
  const mysql = await this.loadMysql();

  const {
    host = '127.0.0.1',
    port = 3306,
    user,
    password,
    database,
    ssl = false,
  } = config;

  if (!user || !database) {
    throw new Error('MySQLConnector: "user" y "database" son obligatorios en DbConfig');
  }

  this.pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    ssl: ssl ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5_000,
  });

  // 🔴 Valida inmediatamente que hay conexión real
  try {
    const conn = await this.pool.getConnection();
    try {
      await conn.ping();
    } finally {
      conn.release();
    }
  } catch (err) {
    // Cierra pool si no hay conexión y lanza error claro
    try { await this.pool.end(); } catch {}
    this.pool = null;
    throw new Error(`MySQLConnector: no se pudo conectar a ${host}:${port}/${database}. Detalle: ${(err as Error).message}`);
  }
  }


  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async health(): Promise<{ ok: boolean; details?: any }> {
    try {
      const rows = await this.query<{ ok: number }>('SELECT 1 AS ok');
      return { ok: rows[0]?.ok === 1, details: { engine: this.engine } };
    } catch (err) {
      return { ok: false, details: { error: (err as Error).message, engine: this.engine } };
    }
  }

  async query<T = any>(statement: string, params?: any): Promise<T[]> {
    if (!this.pool) throw new Error('MySQLConnector: no conectado. Llama a connect() primero.');
    // Nota: mysql2/promise retorna [rows, fields]
    const [rows] = await this.pool.query(statement, params);
    return rows as T[];
  }
}

