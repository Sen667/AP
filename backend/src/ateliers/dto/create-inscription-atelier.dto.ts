import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateInscriptionAtelierDto {
  @ApiProperty({ description: "ID de l'atelier" })
  @IsInt()
  @IsPositive()
  readonly atelierId!: number;

  @ApiProperty({
    description: "ID de l'enfant (optionnel selon le type de public)",
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly enfantId?: number;
}
