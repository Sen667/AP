import { Test, TestingModule } from '@nestjs/testing';
import { SuiviJournalierController } from './suivi-journalier.controller';

describe('SuiviJournalierController', () => {
    let controller: SuiviJournalierController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SuiviJournalierController],
        }).compile();

        controller = module.get<SuiviJournalierController>(SuiviJournalierController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
