import { Test, TestingModule } from '@nestjs/testing';
import { AlgoliaController } from './algolia.controller';
import { AlgoliaService } from './algolia.service';

describe('AlgoliaController', () => {
  let controller: AlgoliaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlgoliaController],
      providers: [AlgoliaService],
    }).compile();

    controller = module.get<AlgoliaController>(AlgoliaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
