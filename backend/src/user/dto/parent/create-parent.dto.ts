import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class CreateParentProfilDto {
    @ApiProperty({ example: '10 rue de la Paix', description: 'Adresse' })
    @IsNotEmpty({ message: "L'adresse est obligatoire" })
    @IsString({ message: "L'adresse doit être une chaîne de caractères" })
    readonly adresse!: string;

    @ApiProperty({ example: '75001', description: 'Code postal' })
    @IsNotEmpty({ message: 'Le code postal est obligatoire' })
    @IsString({ message: 'Le code postal doit être une chaîne de caractères' })
    @Matches(/^[0-9]{5}$/, { message: 'Le code postal doit contenir 5 chiffres' })
    readonly codePostal!: string;

    @ApiProperty({ example: 'Paris', description: 'Ville' })
    @IsNotEmpty({ message: 'La ville est obligatoire' })
    @IsString({ message: 'La ville doit être une chaîne de caractères' })
    readonly ville!: string;

    @ApiProperty({ example: 'Marié(e)', description: 'Situation familiale', required: false })
    @IsOptional()
    @IsString({
        message: 'La situation familiale doit être une chaîne de caractères',
    })
    readonly situationFamiliale?: string;

    @ApiProperty({
        example: 'Ingénieur',
        description: 'Profession',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'La profession doit être une chaîne de caractères' })
    readonly profession?: string;

    @ApiProperty({
        example: 'Entreprise XYZ',
        description: 'Employeur',
        required: false,
    })
    @IsOptional()
    @IsString({ message: "L'employeur doit être une chaîne de caractères" })
    readonly employeur?: string;

    @ApiProperty({
        example: '1234567',
        description: 'Numéro allocataire',
        required: false,
    })
    @IsOptional()
    @IsString({
        message: 'Le numéro allocataire doit être une chaîne de caractères',
    })
    readonly numeroAllocataire?: string;

    @ApiProperty({
        example: true,
        description: 'Bénéficiaire CAF',
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Le statut bénéficiaire CAF doit être un booléen' })
    readonly beneficiaireCAF?: boolean;

    @ApiProperty({
        example: 'Marie Dupont',
        description: "Nom du contact d'urgence",
    })
    @IsNotEmpty({ message: "Le nom du contact d'urgence est obligatoire" })
    @IsString({
        message: "Le nom du contact d'urgence doit être une chaîne de caractères",
    })
    readonly contactUrgenceNom!: string;

    @ApiProperty({
        example: '06 12 34 56 78',
        description: "Téléphone du contact d'urgence",
    })
    @IsNotEmpty({ message: "Le téléphone du contact d'urgence est obligatoire" })
    @IsString({
        message:
            "Le téléphone du contact d'urgence doit être une chaîne de caractères",
    })
    readonly contactUrgenceTel!: string;
}
