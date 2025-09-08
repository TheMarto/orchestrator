import { DbConnectPayloadDto } from 'src/dto/db-config.dto';
import { DatabaseConnectionService } from 'src/services/database-connection/database-connection.service';
export declare class DbController {
    private readonly db;
    constructor(db: DatabaseConnectionService);
    connect(payload: DbConnectPayloadDto): Promise<{
        success: boolean;
        alias: string;
        engine: string;
    }>;
    health(alias?: string): Promise<{
        ok: boolean;
        details?: any;
        alias: string;
    }>;
    listAliases(): {
        aliases: string[];
    };
}
