"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLConnector = void 0;
class MySQLConnector {
    engine = 'mysql';
    pool = null;
    async loadMysql() {
        try {
            const mod = await import('mysql2/promise');
            return mod;
        }
        catch (err) {
            throw new Error('Missing dependency "mysql2". Instala con: npm install mysql2\n' +
                `Detalle: ${err.message}`);
        }
    }
    async connect(config) {
        const mysql = await this.loadMysql();
        const { host = '127.0.0.1', port = 3306, user, password, database, ssl = false, } = config;
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
        try {
            const conn = await this.pool.getConnection();
            try {
                await conn.ping();
            }
            finally {
                conn.release();
            }
        }
        catch (err) {
            try {
                await this.pool.end();
            }
            catch { }
            this.pool = null;
            throw new Error(`MySQLConnector: no se pudo conectar a ${host}:${port}/${database}. Detalle: ${err.message}`);
        }
    }
    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
    }
    async health() {
        try {
            const rows = await this.query('SELECT 1 AS ok');
            return { ok: rows[0]?.ok === 1, details: { engine: this.engine } };
        }
        catch (err) {
            return { ok: false, details: { error: err.message, engine: this.engine } };
        }
    }
    async query(statement, params) {
        if (!this.pool)
            throw new Error('MySQLConnector: no conectado. Llama a connect() primero.');
        const [rows] = await this.pool.query(statement, params);
        return rows;
    }
}
exports.MySQLConnector = MySQLConnector;
//# sourceMappingURL=mysql.connector.js.map