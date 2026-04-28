import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    Min,
} from 'class-validator';

export class CreateContratGardeDto {
    @ApiProperty({ description: "ID de l'enfant" })
    @IsInt()
    @IsPositive()
    readonly enfantId!: number;

    @ApiProperty({ description: "ID de l'assistante maternelle" })
    @IsInt()
    @IsPositive()
    readonly assistantId!: number;

    @ApiProperty({ description: 'Date de début du contrat' })
    @IsDateString()
    readonly dateDebut!: string;

    @ApiProperty({
        description: 'Date de fin du contrat (optionnelle)',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    readonly dateFin?: string;

    @ApiProperty({ description: 'Tarif horaire brut en euros' })
    @IsNumber()
    @Min(0)
    readonly tarifHoraireBrut!: number;

    @ApiProperty({ description: 'Nombre d\'heures par semaine' })
    @IsNumber()
    @IsPositive()
    readonly nombreHeuresSemaine!: number;

    @ApiProperty({ description: 'Indemnité d\'entretien en euros' })
    @IsNumber()
    @Min(0)
    readonly indemniteEntretien!: number;

    @ApiProperty({ description: 'Indemnité de repas en euros' })
    @IsNumber()
    @Min(0)
    readonly indemniteRepas!: number;

    @ApiProperty({
        description: 'Indemnité kilométrique en euros (optionnelle)',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly indemniteKm?: number;
}
