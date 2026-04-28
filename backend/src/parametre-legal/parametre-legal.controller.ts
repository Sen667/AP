import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "generated/types/enums";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/role.guard";
import { Roles } from "src/decorators/roles.decorator";
import { CreateParametreLegalDto } from "./dto/create-parametre-legal.dto";
import { UpdateParametreLegalDto } from "./dto/update-parametre-legal.dto";
import { ParametreLegalService } from "./parametre-legal.service";

@ApiTags("Paramètres Légaux")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("legal-parametres")
export class ParametreLegalController {
    constructor(private readonly service: ParametreLegalService) { }

    @Get()
    @ApiOperation({ summary: 'Récupérer tous les paramètres légaux' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Liste des paramètres légaux actuellement valides",
    })
    async findAll() {
        return await this.service.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: 'Récupérer un paramètre légal par ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Paramètre légal trouvé",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Paramètre légal non trouvé",
    })
    async findById(@Param("id") id: string) {
        return await this.service.findById(parseInt(id));
    }

    @Get("name/:nom")
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Paramètre légal trouvé par nom",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Paramètre légal non trouvé",
    })
    async findByName(@Param("nom") nom: string) {
        return await this.service.findByName(nom);
    }

    @Roles(Role.ADMIN)
    @Post()
    @ApiOperation({ summary: 'Créer un nouveau paramètre légal' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Paramètre légal créé avec succès",
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "Accès refusé - Admin requis",
    })
    async create(@Body() createDto: CreateParametreLegalDto) {
        return await this.service.create(createDto);
    }

    @Roles(Role.ADMIN)
    @Patch(":id")
    @ApiOperation({ summary: 'Mettre à jour un paramètre légal' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Paramètre légal mis à jour avec succès",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Paramètre légal non trouvé",
    })
    async update(
        @Param("id") id: string,
        @Body() updateDto: UpdateParametreLegalDto
    ) {
        return await this.service.update(parseInt(id), updateDto);
    }

    @Roles(Role.ADMIN)
    @Delete(":id")
    @ApiOperation({ summary: 'Supprimer un paramètre légal' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Paramètre légal supprimé avec succès",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Paramètre légal non trouvé",
    })
    async delete(@Param("id") id: string) {
        await this.service.delete(parseInt(id));
        return { message: "Paramètre légal supprimé avec succès" };
    }
}
