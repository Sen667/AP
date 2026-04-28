import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/types/enums';
import { CombinedAuthGuard } from 'src/auth/guards/combined-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { ContratGardeService } from './contrat-garde.service';
import { CreateContratGardeDto } from './dto/create-contrat-garde.dto';
import { DemanderRevocationDto } from './dto/demander-revocation.dto';
import { TraiterRevocationDto } from './dto/traiter-revocation.dto';
import { UpdateContratGardeDto } from './dto/update-contrat-garde.dto';

@ApiTags('Contrat de Garde')
@UseGuards(CombinedAuthGuard)
@Controller('contrat-garde')
export class ContratGardeController {
    constructor(private readonly contratGardeService: ContratGardeService) { }

    @Post()
    @Roles(Role.PARENT)
    @ApiOperation({ summary: 'Créer un nouveau contrat de garde' })
    async create(
        @Body() createContratGardeDto: CreateContratGardeDto,
        @User('userId') userId: number,
    ) {
        const contrat = await this.contratGardeService.create(
            createContratGardeDto,
            userId,
        );
        return {
            message: 'Contrat de garde créé avec succès',
            data: contrat,
        };
    }

    @Get()
    @Roles(Role.PARENT)
    @ApiOperation({ summary: 'Récupérer tous les contrats du parent' })
    async findAll(@User('userId') userId: number) {
        return this.contratGardeService.findAllByParent(userId);
    }

    @Get('enfant/:enfantId')
    @Roles(Role.PARENT)
    @ApiOperation({ summary: "Récupérer tous les contrats d'un enfant" })
    async findByEnfant(
        @Param('enfantId', ParseIntPipe) enfantId: number,
        @User('userId') userId: number,
    ) {
        return this.contratGardeService.findAllByEnfant(enfantId, userId);
    }

    @Get(':id')
    @Roles(Role.PARENT, Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer un contrat par son ID' })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @User('userId') userId: number,
    ) {
        return this.contratGardeService.findOne(id, userId);
    }

    @Patch(':id')
    @Roles(Role.PARENT, Role.ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un contrat' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateContratGardeDto: UpdateContratGardeDto,
        @User('userId') userId: number,
    ) {
        const contrat = await this.contratGardeService.update(
            id,
            updateContratGardeDto,
            userId,
        );
        return {
            message: 'Contrat de garde mis à jour avec succès',
            data: contrat,
        };
    }

    @Delete(':id')
    @Roles(Role.PARENT, Role.ADMIN)
    @ApiOperation({ summary: 'Supprimer un contrat' })
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @User('userId') userId: number,
    ) {
        await this.contratGardeService.remove(id, userId);
        return {
            message: 'Contrat de garde supprimé avec succès',
        };
    }

    @Get('assistant/mes-contrats')
    @Roles(Role.ASSISTANT)
    @ApiOperation({ summary: "Récupérer tous les contrats de l'assistante" })
    async findAllByAssistant(@User('userId') userId: number) {
        return this.contratGardeService.findAllByAssistant(userId);
    }

    @Get('assistant/contrat/:id')
    @Roles(Role.ASSISTANT)
    @ApiOperation({ summary: 'Récupérer un contrat spécifique pour l\'assistante' })
    async findOneByAssistant(
        @Param('id', ParseIntPipe) id: number,
        @User('userId') userId: number,
    ) {
        return this.contratGardeService.findOneByAssistant(id, userId);
    }

    @Patch('assistant/:id/accepter')
    @Roles(Role.ASSISTANT)
    @ApiOperation({ summary: 'Accepter un contrat de garde' })
    async accepterContrat(
        @Param('id', ParseIntPipe) id: number,
        @User('userId') userId: number,
    ) {
        const contrat = await this.contratGardeService.accepterContrat(id, userId);
        return {
            message: 'Contrat de garde accepté avec succès',
            data: contrat,
        };
    }

    @Patch('assistant/:id/refuser')
    @Roles(Role.ASSISTANT)
    @ApiOperation({ summary: 'Refuser un contrat de garde' })
    async refuserContrat(
        @Param('id', ParseIntPipe) id: number,
        @User('userId') userId: number,
    ) {
        const contrat = await this.contratGardeService.refuserContrat(id, userId);
        return {
            message: 'Contrat de garde refusé',
            data: contrat,
        };
    }

    @Post('assistant/:id/demander-revocation')
    @Roles(Role.ASSISTANT)
    @ApiOperation({ summary: 'Demander la révocation d\'un contrat actif' })
    async demanderRevocation(
        @Param('id', ParseIntPipe) id: number,
        @Body() demanderRevocationDto: DemanderRevocationDto,
        @User('userId') userId: number,
    ) {
        const contrat = await this.contratGardeService.demanderRevocation(
            id,
            userId,
            demanderRevocationDto.motif,
        );
        return {
            message: 'Demande de révocation envoyée avec succès',
            data: contrat,
        };
    }

    @Patch(':id/traiter-revocation')
    @Roles(Role.PARENT)
    @ApiOperation({ summary: 'Traiter une demande de révocation (accepter ou refuser)' })
    async traiterRevocation(
        @Param('id', ParseIntPipe) id: number,
        @Body() traiterRevocationDto: TraiterRevocationDto,
        @User('userId') userId: number,
    ) {
        const contrat = await this.contratGardeService.traiterRevocationParent(
            id,
            userId,
            traiterRevocationDto.accepter,
            traiterRevocationDto.commentaire,
        );
        return {
            message: traiterRevocationDto.accepter
                ? 'Révocation acceptée, le contrat est maintenant terminé'
                : 'Révocation refusée, le contrat reste actif',
            data: contrat,
        };
    }

    @Get('admin/tous')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer tous les contrats du RAM (admin)' })
    async findAllAdmin() {
        return this.contratGardeService.findAll();
    }

    @Get('assistant/:assistantId/enfants')
    @Roles(Role.PARENT, Role.ASSISTANT, Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer les enfants gardés par une assistante' })
    async getEnfantsGardesParAssistant(
        @Param('assistantId', ParseIntPipe) assistantId: number,
    ) {
        return this.contratGardeService.getEnfantsGardesParAssistant(assistantId);
    }
}
