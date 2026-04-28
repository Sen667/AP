import { PartialType } from '@nestjs/swagger';
import { CreateSuiviGardeDto } from './create-suivi-garde.dto';

export class UpdateSuiviGardeDto extends PartialType(CreateSuiviGardeDto) { }
