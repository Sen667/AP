import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PartialUserDto } from '../create-user.dto';
import { CreateAssistantProfilDto } from './create-assistant.dto';

export class UpdateAssistantProfilDto extends IntersectionType(
    PartialUserDto,
    PartialType(CreateAssistantProfilDto)
) { }