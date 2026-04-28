import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class TraiterRevocationDto {
    @ApiProperty({
        description: 'Accepter ou refuser la demande de révocation',
        example: true,
    })
    @IsBoolean()
    readonly accepter!: boolean;

    @ApiProperty({
        description: 'Commentaire du parent (optionnel)',
        required: false,
        example: 'J\'accepte la révocation du contrat',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000, {
        message: 'Le commentaire ne peut pas dépasser 1000 caractères',
    })
    readonly commentaire?: string;
}
