import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConnectionService } from './database-connection.service';

describe('DatabaseConnectionService', () => {
  let service: DatabaseConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseConnectionService],
    }).compile();

    service = module.get<DatabaseConnectionService>(DatabaseConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
