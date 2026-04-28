import { Test, TestingModule } from '@nestjs/testing';
import { PersonneAutoriseeController } from './personne-autorisee.controller';

describe('PersonneAutoriseeController', () => {
  let controller: PersonneAutoriseeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonneAutoriseeController],
    }).compile();

    controller = module.get<PersonneAutoriseeController>(PersonneAutoriseeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
