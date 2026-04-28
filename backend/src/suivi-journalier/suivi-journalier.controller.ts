import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { SuiviJournalierService } from './suivi-journalier.service';
import { CreateSuiviJournalierDto } from './dto/create-suivi-journalier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Suivi Journalier')
@ApiBearerAuth()
@Controller('suivi-journalier')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuiviJournalierController {
    constructor(private readonly suiviJournalierService: SuiviJournalierService) { }

    @Post()
    @Roles('ASSISTANT')
    @ApiOperation({ summary: 'Créer ou mettre à jour un suivi journalier (Assistant uniquement)' })
    @ApiResponse({ status: 201, description: 'Suivi créé ou mis à jour avec succès' })
    @ApiResponse({ status: 403, description: 'Accès interdit' })
    @ApiResponse({ status: 404, description: 'Enfant non trouvé' })
    async create(@Request() req: any, @Body() createDto: CreateSuiviJournalierDto) {
        // Récupérer l'ID de l'assistant depuis le profil
        const assistantProfil = await this.suiviJournalierService['prisma'].assistantProfil.findUnique({
            where: { utilisateurId: req.user.userId },
        });

        if (!assistantProfil) {
            throw new Error('Profil assistant non trouvé');
        }

        return this.suiviJournalierService.createOrUpdate(assistantProfil.id, createDto);
    }

    @Get('enfant/:enfantId')
    @Roles('PARENT', 'ASSISTANT', 'ADMIN')
    @ApiOperation({ summary: 'Récupérer tous les suivis d\'un enfant' })
    @ApiResponse({ status: 200, description: 'Liste des suivis récupérée avec succès' })
    @ApiResponse({ status: 403, description: 'Accès interdit' })
    @ApiResponse({ status: 404, description: 'Enfant non trouvé' })
    async findByEnfant(
        @Param('enfantId', ParseIntPipe) enfantId: number,
        @Request() req: any,
    ) {
        return this.suiviJournalierService.findByEnfant(
            enfantId,
            req.user.userId,
            req.user.role,
        );
    }

    @Get(':enfantId/:date')
    @Roles('PARENT', 'ASSISTANT', 'ADMIN')
    @ApiOperation({ summary: 'Récupérer un suivi journalier spécifique' })
    @ApiResponse({ status: 200, description: 'Suivi récupéré avec succès' })
    @ApiResponse({ status: 403, description: 'Accès interdit' })
    @ApiResponse({ status: 404, description: 'Suivi non trouvé' })
    async findOne(
        @Param('enfantId', ParseIntPipe) enfantId: number,
        @Param('date') date: string,
        @Request() req: any,
    ) {
        return this.suiviJournalierService.findOne(
            enfantId,
            date,
            req.user.userId,
            req.user.role,
        );
    }

    @Get('mes-enfants')
    @Roles('ASSISTANT')
    @ApiOperation({ summary: 'Récupérer la liste des enfants de l\'assistant (via contrats actifs)' })
    @ApiResponse({ status: 200, description: 'Liste des enfants récupérée avec succès' })
    async getMesEnfants(@Request() req: any) {
        return this.suiviJournalierService.getEnfantsForAssistant(req.user.userId);
    }
}
