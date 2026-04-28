import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min
} from 'class-validator';

export class GenererPaieDto {
    @ApiProperty({ description: 'ID du contrat de garde' })
    @IsNotEmpty({ message: 'Le contrat de garde est obligatoire' })
    @IsInt({ message: 'L\'ID du contrat doit être un nombre entier' })
    readonly contratId!: number;

    @ApiProperty({ description: 'Mois (1-12)', minimum: 1, maximum: 12 })
    @IsNotEmpty({ message: 'Le mois est obligatoire' })
    @IsInt({ message: 'Le mois doit être un nombre entier' })
    @Min(1, { message: 'Le mois doit être entre 1 et 12' })
    @Max(12, { message: 'Le mois doit être entre 1 et 12' })
    readonly mois!: number;

    @ApiProperty({ description: 'Année', example: 2026 })
    @IsNotEmpty({ message: 'L\'année est obligatoire' })
    @IsInt({ message: 'L\'année doit être un nombre entier' })
    @Min(2020, { message: 'L\'année doit être supérieure ou égale à 2020' })
    @Max(2100, { message: 'L\'année doit être inférieure ou égale à 2100' })
    readonly annee!: number;

    @ApiProperty({ description: 'Commentaire optionnel', required: false })
    @IsOptional()
    @IsString({ message: 'Le commentaire doit être une chaîne de caractères' })
    readonly commentaire?: string;
}
