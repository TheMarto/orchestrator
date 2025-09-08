import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbConnectPayloadDto } from 'src/dto/db-config.dto';
import { DatabaseConnectionService } from 'src/services/database-connection/database-connection.service';

@Controller('db')
export class DbController {
  constructor(private readonly db: DatabaseConnectionService) {}

  @Post('connect')
  async connect(@Body() payload: DbConnectPayloadDto) {
    const alias = payload.alias ?? 'default';
    await this.db.connect(alias, payload.config as any);
    return { success: true, alias, engine: payload.config.engine };
  }

  @Get('health')
  async health(@Query('alias') alias = 'default') {
    const res = await this.db.health(alias);
    return { alias, ...res };
  }

  @Get('aliases')
  listAliases() {
    return { aliases: this.db.listAliases() };
  }
}
