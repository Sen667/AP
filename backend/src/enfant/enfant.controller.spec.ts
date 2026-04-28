import { Test, TestingModule } from '@nestjs/testing';
import { EnfantController } from './enfant.controller';

describe('EnfantController', () => {
  let controller: EnfantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnfantController],
    }).compile();

    controller = module.get<EnfantController>(EnfantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
