import { Test, TestingModule } from '@nestjs/testing';
import { SuiviGardeService } from './suivi-garde.service';

describe('SuiviGardeService', () => {
  let service: SuiviGardeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuiviGardeService],
    }).compile();

    service = module.get<SuiviGardeService>(SuiviGardeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
