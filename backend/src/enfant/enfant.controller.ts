import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/types/enums';
import { CombinedAuthGuard } from 'src/auth/guards/combined-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreateEnfantDto } from './dto/create-enfant.dto';
import { UpdateEnfantDto } from './dto/update-enfant.dto';
import { EnfantService } from './enfant.service';

@ApiTags("Enfant")
@UseGuards(CombinedAuthGuard)
@Controller('enfant')
export class EnfantController {
    constructor(private readonly enfantService: EnfantService) { }

    @Roles(Role.PARENT)
    @Post()
    @ApiOperation({ summary: 'Créer un nouvel enfant' })
    async create(@Body() createEnfantDto: CreateEnfantDto, @User("userId") userId: number) {
        const enfant = await this.enfantService.create(createEnfantDto, userId);

        return {
            message: 'Enfant créé avec succès',
            enfant,
        }
    }

    @Roles(Role.PARENT)
    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour un enfant' })
    async update(@Body() updateEnfantDto: UpdateEnfantDto, @Param('id', ParseIntPipe) enfantId: number, @User("userId") userId: number) {
        const enfant = await this.enfantService.update(+enfantId, updateEnfantDto, +userId);

        return {
            message: 'Enfant mis à jour avec succès',
            enfant,
        };
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un enfant (admin uniquement)' })
    async delete(@Param('id', ParseIntPipe) enfantId: number, @User("userId") userId: number) {
        await this.enfantService.delete(+enfantId, +userId);

        return {
            message: 'Enfant supprimé avec succès',
        };
    }

    @Get('mes-enfants')
    @Roles(Role.PARENT)
    @ApiOperation({ summary: 'Récupérer mes enfants (parent)' })
    async findMyChildren(@User("userId") userId: number) {
        return await this.enfantService.findByParent(userId);
    }

    @Get('admin/enfants')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer tous les enfants (admin)' })
    async findAllChildren() {
        return await this.enfantService.findAllChildren();
    }

    @Get('admin/enfants/:id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer un enfant par ID (admin)' })
    async findChildById(@Param('id', ParseIntPipe) id: number) {
        return await this.enfantService.findChildById(+id);
    }
}
