import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAbsenceDto {
    @IsNumber()
    @IsNotEmpty()
    inscriptionId: number;

    @Type(() => Date)
    @IsNotEmpty()
    dateDebut: Date;

    @Type(() => Date)
    @IsNotEmpty()
    dateFin: Date;

    @IsString()
    @IsOptional()
    motif?: string;
}
