import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AutorisationDto {
    @ApiProperty({ description: "Nom des parents (ex: M. et Mme Dupont)" })
    @IsString()
    @IsNotEmpty()
    readonly parentsNom!: string;

    @ApiProperty({ description: "Nom du parent 1 pour la signature", required: false })
    @IsString()
    @IsOptional()
    readonly parent1Nom?: string;

    @ApiProperty({ description: "Nom du parent 2 pour la signature", required: false })
    @IsString()
    @IsOptional()
    readonly parent2Nom?: string;

    @ApiProperty({ description: "Nom de la première personne autorisée" })
    @IsString()
    @IsNotEmpty()
    readonly personne1Nom!: string;

    @ApiProperty({ description: "Adresse de la première personne autorisée", required: false })
    @IsString()
    @IsOptional()
    readonly personne1Adresse?: string;

    @ApiProperty({ description: "Nom de la deuxième personne autorisée", required: false })
    @IsString()
    @IsOptional()
    readonly personne2Nom?: string;

    @ApiProperty({ description: "Adresse de la deuxième personne autorisée", required: false })
    @IsString()
    @IsOptional()
    readonly personne2Adresse?: string;

    @ApiProperty({ description: "Ville de la deuxième personne autorisée", required: false })
    @IsString()
    @IsOptional()
    readonly personne2Ville?: string;

    @ApiProperty({ description: "Lieu où le document est signé" })
    @IsString()
    @IsNotEmpty()
    readonly faitA!: string;

    @ApiProperty({ description: "Date de signature" })
    @IsString()
    @IsNotEmpty()
    readonly date!: string;
}