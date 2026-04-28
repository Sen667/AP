import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/types/enums';
import { CombinedAuthGuard } from 'src/auth/guards/combined-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreateAssistantProfilDto } from './dto/assistant/create-assistant.dto';
import { UpdateAssistantProfilDto } from './dto/assistant/update-assistant.dto';
import { CreateParentProfilDto } from './dto/parent/create-parent.dto';
import { UpdateParentProfilDto } from './dto/parent/update-parent.dto';
import { UserService } from './user.service';

@ApiTags('Utilisateur')
@UseGuards(CombinedAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    @ApiOperation({ summary: 'Récupérer les informations de l\'utilisateur connecté' })
    async getCurrentUser(@User('userId') userId: number) {
        const user = await this.userService.findById(userId);

        return {
            user,
        };
    }

    @Roles(Role.PARENT)
    @Post('parent')
    @ApiOperation({ summary: 'Créer un profil parent' })
    async createParentProfile(
        @Body() createParentDto: CreateParentProfilDto,
        @User('userId') userId: number,
    ) {
        const profile = await this.userService.createParentProfile(
            userId,
            createParentDto,
        );

        return {
            message: 'Profil parent créé avec succès',
            profile,
        };
    }

    @Roles(Role.PARENT)
    @Patch('parent')
    @ApiOperation({ summary: 'Mettre à jour le profil parent' })
    async updateParentProfile(
        @Body() updateParentDto: UpdateParentProfilDto,
        @User('userId') userId: number,
    ) {
        const profile = await this.userService.updateParentProfile(
            userId,
            updateParentDto,
        );

        return {
            message: 'Profil parent mis à jour avec succès',
            profile,
        };
    }

    @Roles(Role.PARENT)
    @Get('assistants')
    @ApiOperation({ summary: 'Récupérer la liste de toutes les assistantes' })
    async getAllAssistants() {
        const assistants = await this.userService.findAllAssistants();
        return {
            data: assistants,
        };
    }

    @Roles(Role.ASSISTANT)
    @Patch('assistant')
    @ApiOperation({ summary: 'Mettre à jour le profil assistant' })
    async updateAssistantProfile(
        @Body() updateAssistantDto: UpdateAssistantProfilDto,
        @User('userId') userId: number,
    ) {
        const profile = await this.userService.updateAssistantProfile(
            userId,
            updateAssistantDto,
        );

        return {
            message: 'Profil assistant mis à jour avec succès',
            profile,
        };
    }

    @Roles(Role.ASSISTANT)
    @Post('assistant')
    @ApiOperation({ summary: 'Créer un profil assistant' })
    async createAssistantProfile(
        @Body() createAssistantDto: CreateAssistantProfilDto,
        @User('userId') userId: number,
    ) {
        const profile = await this.userService.createAssistantProfile(
            userId,
            createAssistantDto,
        );

        return {
            message: 'Profil assistant créé avec succès',
            profile
        };
    }

    @Get('admin/users')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer tous les utilisateurs (admin)' })
    async findAllUsers() {
        return await this.userService.findAll();
    }

    @Get('admin/users/:id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer un utilisateur par ID (admin)' })
    async findUserById(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.findById(+id);
    }

    @Get('admin/parents')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer tous les parents (admin)' })
    async findAllParents() {
        return await this.userService.findAllParents();
    }

    @Get('admin/parents/:id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer un parent par ID (admin)' })
    async findParentById(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.findParentById(+id);
    }

    @Get('admin/assistants')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer tous les assistants (admin)' })
    async findAllAssistants() {
        return await this.userService.findAllAssistants();
    }

    @Get('admin/assistants/:id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Récupérer un assistant par ID (admin)' })
    async findAssistantById(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.findAssistantById(+id);
    }
}
