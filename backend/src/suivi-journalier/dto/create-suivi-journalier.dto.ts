import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSuiviJournalierDto {
    @ApiProperty({ description: 'ID de l\'enfant' })
    @IsNotEmpty()
    @IsNumber()
    readonly enfantId!: number;

    @ApiProperty({ description: 'Date du suivi (YYYY-MM-DD)' })
    @IsNotEmpty()
    @IsDateString()
    readonly date!: string;

    @ApiPropertyOptional({ description: 'Température en °C' })
    @IsOptional()
    @IsNumber()
    readonly temperature?: number;

    @ApiPropertyOptional({ description: 'Informations sur les pleurs' })
    @IsOptional()
    @IsString()
    readonly pleurs?: string;

    @ApiPropertyOptional({ description: 'Informations sur les besoins (couches, etc.)' })
    @IsOptional()
    @IsString()
    readonly besoins?: string;

    @ApiPropertyOptional({ description: 'Horaires des repas' })
    @IsOptional()
    @IsString()
    readonly repasHoraires?: string;

    @ApiPropertyOptional({ description: 'Aliments consommés' })
    @IsOptional()
    @IsString()
    readonly repasAliments?: string;

    @ApiPropertyOptional({ description: 'Heure de début de sieste' })
    @IsOptional()
    @IsString()
    readonly dodoDeb?: string;

    @ApiPropertyOptional({ description: 'Heure de fin de sieste' })
    @IsOptional()
    @IsString()
    readonly dodoFin?: string;

    @ApiPropertyOptional({ description: 'Humeur (séparée par virgules)' })
    @IsOptional()
    @IsString()
    readonly humeur?: string;

    @ApiPropertyOptional({ description: 'Activités de la journée' })
    @IsOptional()
    @IsString()
    readonly activites?: string;

    @ApiPropertyOptional({ description: 'Horaires des promenades' })
    @IsOptional()
    @IsString()
    readonly promenadeHoraires?: string;

    @ApiPropertyOptional({ description: 'Remarques générales' })
    @IsOptional()
    @IsString()
    readonly remarques?: string;
}
