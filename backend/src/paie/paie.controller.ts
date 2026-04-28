import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { GenererPaieDto } from './dto/generer-paie.dto';
import { PaieService } from './paie.service';

@ApiTags('Paie')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('paie')
export class PaieController {
    constructor(private readonly paieService: PaieService) { }

    @Post('generer')
    @ApiOperation({ summary: 'Générer une fiche de paie' })
    genererPaie(@Body() genererPaieDto: GenererPaieDto) {
        return this.paieService.genererPaie(genererPaieDto);
    }

    @Get()
    @ApiOperation({ summary: 'Récupérer toutes les fiches de paie' })
    @ApiQuery({ name: 'annee', required: false, type: Number })
    @ApiQuery({ name: 'mois', required: false, type: Number })
    findAll(
        @Query('annee', new ParseIntPipe({ optional: true })) annee?: number,
        @Query('mois', new ParseIntPipe({ optional: true })) mois?: number
    ) {
        return this.paieService.findAll(annee, mois);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une fiche de paie par ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.paieService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une fiche de paie' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.paieService.remove(id);
    }
}