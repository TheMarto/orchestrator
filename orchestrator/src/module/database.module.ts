import { Module, OnModuleInit } from '@nestjs/common';
import { MySQLConnector } from 'src/connectors/mysql.connector';
import { DatabaseConnectionService } from 'src/services/database-connection/database-connection.service';

@Module({
  providers: [DatabaseConnectionService],
  exports: [DatabaseConnectionService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly dbConn: DatabaseConnectionService) {}

  /** Registramos el motor 'mysql' al iniciar el módulo */
  onModuleInit() {
    this.dbConn.registerEngine('mysql', () => new MySQLConnector());
    // En el futuro:
    // this.dbConn.registerEngine('postgres', () => new PostgresConnector());
    // this.dbConn.registerEngine('sqlite', () => new SQLiteConnector());
    // this.dbConn.registerEngine('mongo', () => new MongoConnector());
  }
}

