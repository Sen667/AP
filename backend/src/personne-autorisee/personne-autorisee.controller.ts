import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/types/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreatePersonneAutoriseeDto } from './dto/create-parent-autorisee.dto';
import { UpdatePersonneAutoriseeDto } from './dto/update-parent-autorisee.dto';
import { PersonneAutoriseeService } from './personne-autorisee.service';

@ApiTags("Personne Autorisée")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('personne-autorisee')
export class PersonneAutoriseeController {
    constructor(private readonly personneAutoriseeService: PersonneAutoriseeService) { }

    @Get()
    @ApiOperation({ summary: 'Récupérer tous les personnes autorisées' })
    async findAll() {
        return await this.personneAutoriseeService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une personne autorisée par ID' })
    async findById(@Param('id', ParseIntPipe) id: number) {
        return await this.personneAutoriseeService.findById(id);
    }

    @Roles(Role.PARENT)
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle personne autorisée' })
    async create(
        @Body() createDto: CreatePersonneAutoriseeDto,
        @User('userId') userId: number
    ) {
        return await this.personneAutoriseeService.create(createDto, createDto.enfantId, userId);
    }

    @Roles(Role.PARENT)
    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour une personne autorisée' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdatePersonneAutoriseeDto,
        @User('userId') userId: number
    ) {
        return await this.personneAutoriseeService.update(id, updateDto, userId);
    }

    @Roles(Role.PARENT)
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une personne autorisée' })
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @User('userId') userId: number
    ) {
        await this.personneAutoriseeService.delete(id, userId);

        return {
            message: 'Personne autorisée supprimée avec succès',
        };
    }
}
