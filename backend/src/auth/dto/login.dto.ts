import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: "L'adresse email de l'utilisateur"
    })
    @IsNotEmpty({ message: "L'adresse email est obligatoire" })
    @IsEmail({}, { message: "L'adresse email doit être valide" })
    readonly email!: string;

    @ApiProperty({
        example: 'StrongP@ssw0rd!',
        description: "Le mot de passe de l'utilisateur"
    })
    @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
    @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
    readonly password!: string;
}