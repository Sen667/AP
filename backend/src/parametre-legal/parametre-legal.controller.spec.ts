import { Test, TestingModule } from '@nestjs/testing';
import { LegalParametresController } from './parametre-legal.controller';

describe('LegalParametresController', () => {
    let controller: LegalParametresController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LegalParametresController],
        }).compile();

        controller = module.get<LegalParametresController>(LegalParametresController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
