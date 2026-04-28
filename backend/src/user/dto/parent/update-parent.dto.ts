import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PartialUserDto } from '../create-user.dto';
import { CreateParentProfilDto } from './create-parent.dto';

export class UpdateParentProfilDto extends IntersectionType(
    PartialUserDto,
    PartialType(CreateParentProfilDto),
) { }
