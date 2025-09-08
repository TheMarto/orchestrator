import { Test, TestingModule } from '@nestjs/testing';
import { IntrospectorService } from './introspector.service';

describe('IntrospectorService', () => {
  let service: IntrospectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntrospectorService],
    }).compile();

    service = module.get<IntrospectorService>(IntrospectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
