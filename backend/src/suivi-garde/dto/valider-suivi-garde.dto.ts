import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Min
} from 'class-validator';
import { StatutValidation } from 'generated/types';

export class ValiderSuiviGardeDto {
    @ApiProperty({ description: 'Heure d\'arrivée en minutes depuis minuit (0-1439)', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'L\'heure d\'arrivée doit être un nombre' })
    @Min(0, { message: 'L\'heure d\'arrivée doit être entre 0 et 1439 minutes' })
    readonly arriveeMinutes?: number;

    @ApiProperty({ description: 'Heure de départ en minutes depuis minuit (0-1439)', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'L\'heure de départ doit être un nombre' })
    @Min(0, { message: 'L\'heure de départ doit être entre 0 et 1439 minutes' })
    readonly departMinutes?: number;

    @ApiProperty({ description: 'Nombre de repas fournis', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'Le nombre de repas doit être un nombre' })
    @Min(0, { message: 'Le nombre de repas ne peut pas être négatif' })
    readonly repasFournis?: number;

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

    @ApiProperty({
        description: 'Statut de validation',
        enum: StatutValidation,
        example: StatutValidation.VALIDE
    })
    @IsEnum(StatutValidation, {
        message: 'Le statut doit être EN_ATTENTE, VALIDE ou REFUSE'
    })
    readonly statut!: StatutValidation;

    @ApiProperty({ description: 'Commentaire du parent', required: false })
    @IsOptional()
    @IsString({ message: 'Le commentaire doit être une chaîne de caractères' })
    readonly commentaireParent?: string;
}
