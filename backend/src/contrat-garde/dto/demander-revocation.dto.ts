import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DemanderRevocationDto {
    @ApiProperty({
        description: 'Motif de la demande de révocation du contrat',
        example: 'Changement de situation personnelle nécessitant un arrêt de l\'activité',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le motif est obligatoire' })
    @MaxLength(1000, {
        message: 'Le motif ne peut pas dépasser 1000 caractères',
    })
    readonly motif!: string;
}
