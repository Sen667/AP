import { Module } from '@nestjs/common';
import { SuiviJournalierController } from './suivi-journalier.controller';
import { SuiviJournalierService } from './suivi-journalier.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SuiviJournalierController],
    providers: [SuiviJournalierService],
    exports: [SuiviJournalierService],
})
export class SuiviJournalierModule { }
