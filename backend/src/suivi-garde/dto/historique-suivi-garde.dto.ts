import { ApiProperty } from '@nestjs/swagger';
export class HistoriqueSuiviGardeDto {
    @ApiProperty({ description: 'Identifiant de l\'historique' })
    readonly id!: number;

    @ApiProperty({ description: 'Type d\'entité' })
    readonly entityType!: string;

    @ApiProperty({ description: 'Identifiant de l\'entité' })
    readonly entityId!: number;

    @ApiProperty({ description: 'Action effectuée' })
    readonly action!: string;

    @ApiProperty({ required: false, description: 'Données avant modification' })
    readonly beforeData?: any;

    @ApiProperty({ required: false, description: 'Données après modification' })
    readonly afterData?: any;

    @ApiProperty({ description: 'Date de création' })
    readonly createdAt!: Date;

    @ApiProperty({ description: 'Date de mise à jour' })
    readonly updatedAt!: Date;
}
