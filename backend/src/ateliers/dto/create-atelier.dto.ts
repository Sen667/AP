import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TypePublicAtelier } from 'generated/types/enums';

export class CreateAtelierDto {
  @ApiProperty({ description: "Nom de l'atelier" })
  @IsString()
  readonly nom!: string;

  @ApiProperty({ description: "Description de l'atelier", required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ description: "Date de l'atelier (ISO 8601)" })
  @IsDateString()
  readonly date!: string;

  @ApiProperty({ description: 'Heure de début (minutes depuis minuit)' })
  @IsInt()
  @Min(0)
  @Max(1439)
  readonly debutMinutes!: number;

  @ApiProperty({ description: 'Heure de fin (minutes depuis minuit)' })
  @IsInt()
  @Min(0)
  @Max(1439)
  readonly finMinutes!: number;

  @ApiProperty({ description: "Date limite d'inscription (ISO 8601)" })
  @IsDateString()
  readonly dateLimiteInscription!: string;

  @ApiProperty({ description: 'Nombre de places disponibles' })
  @IsInt()
  @IsPositive()
  readonly nombrePlaces!: number;

  @ApiProperty({ description: "Lieu de l'atelier" })
  @IsString()
  readonly lieu!: string;

  @ApiProperty({ enum: TypePublicAtelier, description: 'Type de public visé' })
  @IsEnum(TypePublicAtelier)
  readonly typePublic!: TypePublicAtelier;

  @ApiProperty({ description: 'Âge minimum en mois', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly ageMinMois?: number;

  @ApiProperty({ description: 'Âge maximum en mois', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly ageMaxMois?: number;

  @ApiProperty({
    description: "ID de l'animatrice (assistante)",
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly animateurId?: number;
}
