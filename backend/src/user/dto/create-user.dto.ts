import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';
import { Role, Sexe } from 'generated/types/enums';

export class CreateUserDto {
    @ApiProperty({ example: 'Doe', description: "Le nom de l'utilisateur" })
    @IsNotEmpty({ message: 'Le nom est obligatoire' })
    @IsString({ message: 'Le nom doit être une chaîne de caractères' })
    readonly nom!: string;

    @ApiProperty({ example: 'John', description: "Le prénom de l'utilisateur" })
    @IsNotEmpty({ message: 'Le prénom est obligatoire' })
    @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
    readonly prenom!: string;

    @ApiProperty({
        example: '06 12 34 56 78',
        description: "Le numéro de téléphone de l'utilisateur",
    })
    @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire' })
    @IsString({
        message: 'Le numéro de téléphone doit être une chaîne de caractères',
    })
    readonly telephone!: string;

    @ApiProperty({ example: '1990-05-15' })
    @IsNotEmpty({ message: 'La date de naissance est obligatoire' })
    @IsDateString({}, { message: 'La date doit être valide' })
    readonly dateNaissance!: string;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: "L'email de l'utilisateur",
    })
    @IsNotEmpty({ message: "L'email est obligatoire" })
    @IsString({ message: "L'email doit être une chaîne de caractères" })
    @IsEmail({}, { message: "L'email doit être une adresse email valide" })
    readonly email!: string;

    @ApiProperty({
        example: 'P@ssw0rd!23',
        description: "Le mot de passe de l'utilisateur",
    })
    @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
    @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
    @IsStrongPassword(
        {
            minLength: 10,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message:
                'Le mot de passe doit contenir au moins 10 caractères, une lettre majuscule, un chiffre et un symbole',
        },
    )
    readonly password!: string;

    @ApiProperty({
        example: 'PARENT',
        description: "Le rôle de l'utilisateur",
        enum: Role,
    })
    @IsNotEmpty({ message: 'Le rôle est obligatoire' })
    @IsEnum(Role, {
        message:
            'Le rôle doit être une valeur valide (ADMIN, PARENT, ASSISTANT_MATERNEL)',
    })
    readonly role!: Role;

    @ApiProperty({
        example: 'MASCULIN',
        description: "Le sexe de l'utilisateur",
        enum: Sexe,
    })
    @IsNotEmpty({ message: 'Le sexe est obligatoire' })
    @IsEnum(Sexe, {
        message: 'Le sexe doit être une valeur valide (MASCULIN, FEMININ)',
    })
    readonly sexe!: Sexe;
}

export class PartialUserDto extends PartialType(
    OmitType(CreateUserDto, ['email', 'password', 'role', 'sexe'] as const),
) { }
