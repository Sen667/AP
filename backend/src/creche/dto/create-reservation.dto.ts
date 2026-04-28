import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
    @IsNumber()
    @IsNotEmpty()
    enfantId: number;

    @IsNumber()
    @IsNotEmpty()
    parentId: number;

    @Type(() => Date)
    @IsNotEmpty()
    date: Date;

    @IsNumber()
    @IsNotEmpty()
    arriveeMinutes: number;

    @IsNumber()
    @IsNotEmpty()
    departMinutes: number;

    @IsNumber()
    @IsOptional()
    montant?: number;
}
