import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    Max,
    Min
} from 'class-validator';

export class CreateAssistantProfilDto {
    @ApiProperty({ example: '25 avenue des Lilas', description: 'Adresse' })
    @IsNotEmpty({ message: 'L\'adresse est obligatoire' })
    @IsString({ message: 'L\'adresse doit être une chaîne de caractères' })
    readonly adresse!: string;

    @ApiProperty({ example: '59000', description: 'Code postal' })
    @IsNotEmpty({ message: 'Le code postal est obligatoire' })
    @IsString({ message: 'Le code postal doit être une chaîne de caractères' })
    @Matches(/^[0-9]{5}$/, { message: 'Le code postal doit contenir 5 chiffres' })
    readonly codePostal!: string;

    @ApiProperty({ example: 'Lille', description: 'Ville' })
    @IsNotEmpty({ message: 'La ville est obligatoire' })
    @IsString({ message: 'La ville doit être une chaîne de caractères' })
    readonly ville!: string;

    @ApiProperty({ example: 'AM-2023-12345', description: 'Numéro d\'agrément' })
    @IsNotEmpty({ message: 'Le numéro d\'agrément est obligatoire' })
    @IsString({ message: 'Le numéro d\'agrément doit être une chaîne de caractères' })
    readonly numeroAgrement!: string;

    @ApiProperty({ example: '2020-01-15', description: 'Date d\'obtention de l\'agrément' })
    @IsNotEmpty({ message: 'La date d\'obtention de l\'agrément est obligatoire' })
    @IsDateString({}, { message: 'La date d\'obtention doit être une date valide' })
    readonly dateObtentionAgrement!: string;

    @ApiProperty({ example: '2025-01-15', description: 'Date de fin d\'agrément', required: false })
    @IsOptional()
    @IsDateString({}, { message: 'La date de fin d\'agrément doit être une date valide' })
    readonly dateFinAgrement?: string;

    @ApiProperty({ example: 2, description: 'Capacité d\'accueil (nombre d\'enfants)', minimum: 1, maximum: 4 })
    @IsNotEmpty({ message: 'La capacité d\'accueil est obligatoire' })
    @IsInt({ message: 'La capacité d\'accueil doit être un nombre entier' })
    @Min(1, { message: 'La capacité d\'accueil doit être au minimum de 1' })
    @Max(4, { message: 'La capacité d\'accueil doit être au maximum de 4' })
    readonly capaciteAccueil!: number;

    @ApiProperty({ example: 5, description: 'Années d\'expérience', required: false })
    @IsInt({ message: 'L\'expérience doit être un nombre entier' })
    @Min(0, { message: 'L\'expérience ne peut pas être négative' })
    readonly experience!: number;

    @ApiProperty({
        example: 'Disponible du lundi au vendredi de 7h à 19h',
        description: 'Disponibilités',
        required: false
    })
    @IsString({ message: 'Les disponibilités doivent être une chaîne de caractères' })
    readonly disponibilites!: string;
}