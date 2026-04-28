import { PartialType } from '@nestjs/swagger';
import { CreateSuiviJournalierDto } from './create-suivi-journalier.dto';

export class UpdateSuiviJournalierDto extends PartialType(CreateSuiviJournalierDto) { }
