import { Test, TestingModule } from '@nestjs/testing';
import { ContratGardeController } from './contrat-garde.controller';

describe('ContratGardeController', () => {
  let controller: ContratGardeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratGardeController],
    }).compile();

    controller = module.get<ContratGardeController>(ContratGardeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
