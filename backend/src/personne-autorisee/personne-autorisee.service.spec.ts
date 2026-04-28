import { Test, TestingModule } from '@nestjs/testing';
import { PersonneAutoriseeService } from './personne-autorisee.service';

describe('PersonneAutoriseeService', () => {
  let service: PersonneAutoriseeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonneAutoriseeService],
    }).compile();

    service = module.get<PersonneAutoriseeService>(PersonneAutoriseeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
