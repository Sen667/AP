import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePersonneAutoriseeDto {
    @IsNotEmpty()
    @IsNumber()
    readonly enfantId!: number;

    @IsNotEmpty({ message: "Le nom ne peut pas être vide" })
    @IsString({ message: "Le nom doit être une chaîne de caractères" })
    readonly nom!: string;

    @IsNotEmpty({ message: "Le prénom ne peut pas être vide" })
    @IsString({ message: "Le prénom doit être une chaîne de caractères" })
    readonly prenom!: string;

    @IsNotEmpty({ message: "Le téléphone ne peut pas être vide" })
    @IsString({ message: "Le téléphone doit être une chaîne de caractères" })
    readonly telephone!: string;

    @IsNotEmpty({ message: "L'email ne peut pas être vide" })
    @IsEmail({}, { message: "L'email doit être valide" })
    readonly email!: string;

    @IsOptional()
    @IsString({ message: "Le lien doit être une chaîne de caractères" })
    readonly lien?: string;
}