import { Test, TestingModule } from '@nestjs/testing';
import { SuiviGardeController } from './suivi-garde.controller';

describe('SuiviGardeController', () => {
  let controller: SuiviGardeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuiviGardeController],
    }).compile();

    controller = module.get<SuiviGardeController>(SuiviGardeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
