import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { CreateSuiviGardeDto } from './dto/create-suivi-garde.dto';
import { UpdateSuiviGardeDto } from './dto/update-suivi-garde.dto';
import { ValiderSuiviGardeDto } from './dto/valider-suivi-garde.dto';
import { SuiviGardeService } from './suivi-garde.service';

@ApiTags('Suivi de garde')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suivi-garde')
export class SuiviGardeController {
    constructor(private readonly suiviGardeService: SuiviGardeService) { }

    @Post('assistant')
    @Roles('ASSISTANT')
    @ApiOperation({ summary: 'Créer un suivi de garde (assistante)' })
    create(@Body() createSuiviGardeDto: CreateSuiviGardeDto, @User('userId') userId: number) {
        return this.suiviGardeService.create(createSuiviGardeDto, userId);
    }

    @Get('assistant')
    @Roles('ASSISTANT')
    @ApiOperation({ summary: 'Récupérer tous les suivis de garde (assistante)' })
    @ApiQuery({ name: 'mois', required: false, type: Number })
    @ApiQuery({ name: 'annee', required: false, type: Number })
    findAllByAssistant(
        @User('userId') userId: number,
        @Query('mois', new ParseIntPipe({ optional: true })) mois?: number,
        @Query('annee', new ParseIntPipe({ optional: true })) annee?: number
    ) {
        return this.suiviGardeService.findAllByAssistant(userId, mois, annee);
    }

    @Get('assistant/:id')
    @Roles('ASSISTANT')
    @ApiOperation({ summary: 'Récupérer un suivi de garde par ID (assistante)' })
    findOneByAssistant(@Param('id', ParseIntPipe) id: number, @User('userId') userId: number) {
        return this.suiviGardeService.findOneByAssistant(id, userId);
    }

    @Patch('assistant/:id')
    @Roles('ASSISTANT')
    @ApiOperation({ summary: 'Mettre à jour un suivi de garde (assistante)' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSuiviGardeDto: UpdateSuiviGardeDto,
        @User('userId') userId: number
    ) {
        return this.suiviGardeService.update(id, updateSuiviGardeDto, userId);
    }

    @Delete('assistant/:id')
    @Roles('ASSISTANT')
    @ApiOperation({ summary: 'Supprimer un suivi de garde (assistante)' })
    remove(@Param('id', ParseIntPipe) id: number, @User('userId') userId: number) {
        return this.suiviGardeService.remove(id, userId);
    }

    @Get('parent')
    @Roles('PARENT')
    @ApiOperation({ summary: 'Récupérer tous les suivis de garde (parent)' })
    @ApiQuery({ name: 'mois', required: false, type: Number })
    @ApiQuery({ name: 'annee', required: false, type: Number })
    findAllByParent(
        @User('userId') userId: number,
        @Query('mois', new ParseIntPipe({ optional: true })) mois?: number,
        @Query('annee', new ParseIntPipe({ optional: true })) annee?: number
    ) {
        return this.suiviGardeService.findAllByParent(userId, mois, annee);
    }

    @Get('parent/:id')
    @Roles('PARENT')
    @ApiOperation({ summary: 'Récupérer un suivi de garde par ID (parent)' })
    findOneByParent(@Param('id', ParseIntPipe) id: number, @User('userId') userId: number) {
        return this.suiviGardeService.findOneByParent(id, userId);
    }

    @Patch('parent/:id/valider')
    @Roles('PARENT')
    @ApiOperation({ summary: 'Valider ou modifier un suivi de garde (parent)' })
    validerSuivi(
        @Param('id', ParseIntPipe) id: number,
        @Body() validerDto: ValiderSuiviGardeDto,
        @User('userId') userId: number
    ) {
        return this.suiviGardeService.validerSuivi(id, validerDto, userId);
    }

    @Get('admin')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Récupérer tous les suivis de garde (admin)' })
    @ApiQuery({ name: 'mois', required: false, type: Number })
    @ApiQuery({ name: 'annee', required: false, type: Number })
    findAll(
        @Query('mois', new ParseIntPipe({ optional: true })) mois?: number,
        @Query('annee', new ParseIntPipe({ optional: true })) annee?: number
    ) {
        return this.suiviGardeService.findAll(mois, annee);
    }

    @Get('admin/:id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Récupérer un suivi de garde par ID (admin)' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.suiviGardeService.findOne(id);
    }

    @Get(':id/historique')
    @Roles('ADMIN', 'PARENT')
    @ApiOperation({ summary: 'Récupérer l\'historique des modifications d\'un suivi de garde' })
    getHistorique(@Param('id', ParseIntPipe) id: number) {
        return this.suiviGardeService.getHistorique(id);
    }
}

