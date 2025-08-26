import { Test, TestingModule } from '@nestjs/testing';
import { OllamaProxyController } from './ollama-proxy.controller';

describe('OllamaProxyController', () => {
  let controller: OllamaProxyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OllamaProxyController],
    }).compile();

    controller = module.get<OllamaProxyController>(OllamaProxyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
