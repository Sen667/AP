import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateParametreLegalDto {
    @IsString()
    readonly nom!: string;

    @IsNumber()
    readonly valeur!: number;

    @IsNumber()
    @IsOptional()
    readonly valeurNet?: number;

    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsDateString()
    readonly dateMiseEnVigueur!: string;

    @IsDateString()
    @IsOptional()
    readonly dateFinVigueur?: string;
}
