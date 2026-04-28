import { Test, TestingModule } from '@nestjs/testing';
import { EnfantService } from './enfant.service';

describe('EnfantService', () => {
  let service: EnfantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnfantService],
    }).compile();

    service = module.get<EnfantService>(EnfantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
