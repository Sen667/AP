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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/types/enums';
import { CombinedAuthGuard } from 'src/auth/guards/combined-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { AteliersService } from './ateliers.service';
import { CreateAtelierDto } from './dto/create-atelier.dto';
import { CreateInscriptionAtelierDto } from './dto/create-inscription-atelier.dto';
import { UpdateAtelierDto } from './dto/update-atelier.dto';

@ApiTags('Ateliers')
@UseGuards(CombinedAuthGuard)
@Controller('ateliers')
export class AteliersController {
  constructor(private readonly ateliersService: AteliersService) {}

  @Get()
  @Roles(Role.PARENT, Role.ASSISTANT, Role.ADMIN)
  @ApiOperation({ summary: 'Lister tous les ateliers' })
  @ApiQuery({ name: 'typePublic', required: false })
  findAll(@Query('typePublic') typePublic?: string) {
    return this.ateliersService.findAll(typePublic);
  }

  @Get('upcoming')
  @Roles(Role.PARENT, Role.ASSISTANT, Role.ADMIN)
  @ApiOperation({ summary: 'Lister les ateliers à venir' })
  findUpcoming() {
    return this.ateliersService.findUpcoming();
  }

  @Get(':id')
  @Roles(Role.PARENT, Role.ASSISTANT, Role.ADMIN)
  @ApiOperation({ summary: "Détail d'un atelier" })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ateliersService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Créer un atelier (Admin)' })
  async create(@Body() dto: CreateAtelierDto) {
    const data = await this.ateliersService.create(dto);
    return { message: 'Atelier créé avec succès', data };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Modifier un atelier (Admin)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAtelierDto,
  ) {
    const data = await this.ateliersService.update(id, dto);
    return { message: 'Atelier mis à jour', data };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un atelier (Admin)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ateliersService.remove(id);
    return { message: 'Atelier supprimé' };
  }

  @Post('inscriptions')
  @Roles(Role.PARENT)
  @ApiOperation({ summary: "S'inscrire à un atelier (Parent)" })
  async inscrire(
    @Body() dto: CreateInscriptionAtelierDto,
    @User('userId') userId: number,
  ) {
    const data = await this.ateliersService.inscrire(dto, userId);
    return { message: 'Inscription réalisée avec succès', data };
  }

  @Post('inscriptions/assistant')
  @Roles(Role.ASSISTANT)
  @ApiOperation({ summary: "S'inscrire à un atelier (Assistant)" })
  async inscrireAssistant(
    @Body() dto: CreateInscriptionAtelierDto,
    @User('userId') userId: number,
  ) {
    const data = await this.ateliersService.inscrireAssistant(dto, userId);
    return { message: 'Inscription réalisée avec succès', data };
  }

  @Delete('inscriptions/:atelierId')
  @Roles(Role.PARENT)
  @ApiOperation({ summary: "Se désinscrire d'un atelier (Parent)" })
  async desinscrire(
    @Param('atelierId', ParseIntPipe) atelierId: number,
    @User('userId') userId: number,
  ) {
    await this.ateliersService.desinscrire(atelierId, userId);
    return { message: 'Désinscription effectuée' };
  }

  @Delete('inscriptions/assistant/:atelierId')
  @Roles(Role.ASSISTANT)
  @ApiOperation({ summary: "Se désinscrire d'un atelier (Assistant)" })
  async desinscrireAssistant(
    @Param('atelierId', ParseIntPipe) atelierId: number,
    @User('userId') userId: number,
  ) {
    await this.ateliersService.desinscrireAssistant(atelierId, userId);
    return { message: 'Désinscription effectuée' };
  }

  @Get('inscriptions/mes-inscriptions')
  @Roles(Role.PARENT)
  @ApiOperation({ summary: 'Mes inscriptions (Parent)' })
  mesInscriptions(@User('userId') userId: number) {
    return this.ateliersService.mesInscriptions(userId);
  }

  @Get('inscriptions/assistant/mes-inscriptions')
  @Roles(Role.ASSISTANT)
  @ApiOperation({ summary: 'Mes inscriptions (Assistant)' })
  mesInscriptionsAssistant(@User('userId') userId: number) {
    return this.ateliersService.mesInscriptionsAssistant(userId);
  }

  @Patch('inscriptions/:inscriptionId/presence')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Marquer présence (Admin)' })
  async marquerPresence(
    @Param('inscriptionId', ParseIntPipe) inscriptionId: number,
    @Body('present') present: boolean,
  ) {
    const data = await this.ateliersService.marquerPresence(
      inscriptionId,
      present,
    );
    return { message: 'Présence mise à jour', data };
  }
}
