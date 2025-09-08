import { OnModuleInit } from '@nestjs/common';
import { DatabaseConnectionService } from 'src/services/database-connection/database-connection.service';
export declare class DatabaseModule implements OnModuleInit {
    private readonly dbConn;
    constructor(dbConn: DatabaseConnectionService);
    onModuleInit(): void;
}
