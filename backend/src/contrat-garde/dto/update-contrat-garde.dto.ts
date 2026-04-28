import { PartialType } from '@nestjs/swagger';
import { CreateContratGardeDto } from './create-contrat-garde.dto';

export class UpdateContratGardeDto extends PartialType(CreateContratGardeDto) { }
