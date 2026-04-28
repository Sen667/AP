import { Test, TestingModule } from '@nestjs/testing';
import { PaieService } from './paie.service';

describe('PaieService', () => {
  let service: PaieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaieService],
    }).compile();

    service = module.get<PaieService>(PaieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
