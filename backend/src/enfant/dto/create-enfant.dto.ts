import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Sexe } from "generated/types/enums";

export class CreateEnfantDto {
    @ApiProperty({ example: 'Dupont', description: 'Le nom de l\'enfant' })
    @IsNotEmpty({ message: 'Le nom est obligatoire' })
    @IsString({ message: 'Le nom doit être une chaîne de caractères' })
    readonly nom!: string;

    @ApiProperty({ example: 'Marie', description: 'Le prénom de l\'enfant' })
    @IsNotEmpty({ message: 'Le prénom est obligatoire' })
    @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
    readonly prenom!: string;

    @ApiProperty({ example: '2018-04-12', description: 'La date de naissance de l\'enfant' })
    @IsNotEmpty({ message: 'La date de naissance est obligatoire' })
    @IsDateString({}, { message: 'La date de naissance doit être une date valide' })
    readonly dateNaissance!: string;

    @ApiProperty({ example: 'FEMININ', description: 'Le sexe de l\'enfant', enum: Sexe })
    @IsNotEmpty({ message: 'Le sexe est obligatoire' })
    @IsEnum(Sexe, { message: 'Le sexe doit être une valeur valide (MASCULIN, FEMININ)' })
    readonly sexe!: Sexe;

    @ApiProperty({ example: 'Arachides, gluten', description: 'Les allergies de l\'enfant', required: false })
    @IsOptional()
    @IsString({ message: 'Les allergies doivent être une chaîne de caractères' })
    readonly allergies?: string | null;

    @ApiProperty({ example: 'L\'enfant est asthmatique.', description: 'Les remarques médicales de l\'enfant', required: false })
    @IsOptional()
    @IsString({ message: 'Les remarques médicales doivent être une chaîne de caractères' })
    readonly remarquesMedicales?: string | null;

    @ApiProperty({ example: 'Dr. Martin Dupuis', description: 'Le médecin traitant de l\'enfant' })
    @IsNotEmpty({ message: 'Le médecin traitant est obligatoire' })
    @IsString({ message: 'Le médecin traitant doit être une chaîne de caractères' })
    readonly medecinTraitant!: string;

    @ApiProperty({ example: '06 98 76 54 32', description: 'Le téléphone du médecin traitant de l\'enfant' })
    @IsNotEmpty({ message: 'Le téléphone du médecin traitant est obligatoire' })
    @IsString({ message: 'Le téléphone du médecin traitant doit être une chaîne de caractères' })
    readonly medecinTraitantTel!: string;
}