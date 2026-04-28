import { Test, TestingModule } from '@nestjs/testing';
import { AteliersController } from './ateliers.controller';

describe('AteliersController', () => {
  let controller: AteliersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AteliersController],
    }).compile();

    controller = module.get<AteliersController>(AteliersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
