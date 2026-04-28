import { Test, TestingModule } from '@nestjs/testing';
import { ContratGardeService } from './contrat-garde.service';

describe('ContratGardeService', () => {
  let service: ContratGardeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratGardeService],
    }).compile();

    service = module.get<ContratGardeService>(ContratGardeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
