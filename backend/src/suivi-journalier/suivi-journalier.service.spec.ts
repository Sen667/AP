import { Test, TestingModule } from '@nestjs/testing';
import { SuiviJournalierService } from './suivi-journalier.service';

describe('SuiviJournalierService', () => {
    let service: SuiviJournalierService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SuiviJournalierService],
        }).compile();

        service = module.get<SuiviJournalierService>(SuiviJournalierService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
