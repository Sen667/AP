import { Test, TestingModule } from '@nestjs/testing';
import { LegalParametresService } from './parametre-legal.service';

describe('LegalParametresService', () => {
    let service: LegalParametresService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LegalParametresService],
        }).compile();

        service = module.get<LegalParametresService>(LegalParametresService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
