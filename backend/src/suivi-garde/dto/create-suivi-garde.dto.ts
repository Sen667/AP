import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    Min
} from 'class-validator';

export class CreateSuiviGardeDto {
    @ApiProperty({ description: 'ID du contrat de garde' })
    @IsNotEmpty({ message: 'Le contrat de garde est obligatoire' })
    @IsInt({ message: 'L\'ID du contrat doit être un nombre entier' })
    @IsPositive({ message: 'L\'ID du contrat doit être positif' })
    readonly contratId!: number;

    @ApiProperty({ description: 'Date de garde (format: YYYY-MM-DD)' })
    @IsNotEmpty({ message: 'La date est obligatoire' })
    @IsDateString({}, { message: 'La date doit être au format valide' })
    readonly date!: string;

    @ApiProperty({ description: 'Heure d\'arrivée en minutes depuis minuit (0-1439)', required: false })
    @IsOptional()
    @IsInt({ message: 'L\'heure d\'arrivée doit être un nombre entier' })
    @Min(0, { message: 'L\'heure d\'arrivée doit être entre 0 et 1439 minutes' })
    readonly arriveeMinutes?: number;

    @ApiProperty({ description: 'Heure de départ en minutes depuis minuit (0-1439)', required: false })
    @IsOptional()
    @IsInt({ message: 'L\'heure de départ doit être un nombre entier' })
    @Min(0, { message: 'L\'heure de départ doit être entre 0 et 1439 minutes' })
    readonly departMinutes?: number;

    @ApiProperty({ description: 'Nombre de repas fournis', default: 0 })
    @IsNotEmpty({ message: 'Le nombre de repas est obligatoire' })
    @IsInt({ message: 'Le nombre de repas doit être un nombre entier' })
    @Min(0, { message: 'Le nombre de repas ne peut pas être négatif' })
    readonly repasFournis!: number;

    @ApiProperty({ description: 'Frais divers en euros', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'Les frais divers doivent être un nombre' })
    @Min(0, { message: 'Les frais divers ne peuvent pas être négatifs' })
    readonly fraisDivers?: number;

    @ApiProperty({ description: 'Kilomètres parcourus', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'Les kilomètres doivent être un nombre' })
    @Min(0, { message: 'Les kilomètres ne peuvent pas être négatifs' })
    readonly km?: number;
}
