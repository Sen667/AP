import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeAccueilCreche, JourSemaine } from 'generated/types';

export class CreateInscriptionDto {
    @IsNumber()
    @IsNotEmpty()
    enfantId: number;

    @IsNumber()
    @IsNotEmpty()
    parentId: number;

    @IsEnum(TypeAccueilCreche)
    @IsNotEmpty()
    typeAccueil: TypeAccueilCreche;

    @Type(() => Date)
    @IsNotEmpty()
    dateDebut: Date;

    @Type(() => Date)
    @IsOptional()
    dateFin?: Date;

    @IsArray()
    @IsEnum(JourSemaine, { each: true })
    @IsOptional()
    jours?: JourSemaine[];
}
