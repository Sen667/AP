import { Controller, Post, Body, Get, Param, ParseIntPipe, Query, Put, Delete } from '@nestjs/common';
import { CrecheService } from './creche.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { CreateInscriptionDto } from './dto/create-inscription.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Creche')
@Controller('creche')
export class CrecheController {
    constructor(private readonly crecheService: CrecheService) { }

    @Post('inscription')
    @ApiOperation({ summary: 'Inscrire un enfant (Régulier ou Occasionnel)' })
    createInscription(@Body() createInscriptionDto: CreateInscriptionDto) {
        return this.crecheService.createInscription(createInscriptionDto);
    }

    @Post('reservation')
    @ApiOperation({ summary: 'Réserver une place (au moins 24h à l\'avance)' })
    createReservation(@Body() createReservationDto: CreateReservationDto) {
        return this.crecheService.createReservation(createReservationDto);
    }

    @Get('disponibilite')
    @ApiOperation({ summary: 'Vérifier les places disponibles pour une date (YYYY-MM-DD)' })
    checkDisponibilite(@Query('date') dateString: string) {
        const date = new Date(dateString);
        return this.crecheService.checkPlacesDisponibles(date).then(places => ({ places }));
    }

    @Get('parent/:parentId/inscriptions')
    @ApiOperation({ summary: 'Récupérer les inscriptions d\'un parent' })
    getInscriptions(@Param('parentId', ParseIntPipe) parentId: number) {
        return this.crecheService.getInscriptionsByParent(parentId);
    }

    @Get('parent/:parentId/reservations')
    @ApiOperation({ summary: 'Récupérer les consommations (réservations) d\'un parent' })
    getReservations(@Param('parentId', ParseIntPipe) parentId: number) {
        return this.crecheService.getReservationsByParent(parentId);
    }

    @Get('inscriptions')
    @ApiOperation({ summary: 'Récupérer toutes les inscriptions régulières et occasionnelles (Admin)' })
    getAllInscriptions() {
        return this.crecheService.getAllInscriptions();
    }

    @Get('reservations')
    @ApiOperation({ summary: 'Récupérer toutes les réservations occasionnelles (Admin)' })
    getAllReservations() {
        return this.crecheService.getAllReservations();
    }

    @Put('inscription/:id')
    @ApiOperation({ summary: 'Mettre à jour une inscription (Admin)' })
    updateInscription(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.crecheService.updateInscription(id, data);
    }

    @Delete('inscription/:id')
    @ApiOperation({ summary: 'Supprimer une inscription (Admin)' })
    deleteInscription(@Param('id', ParseIntPipe) id: number) {
        return this.crecheService.deleteInscription(id);
    }

    @Put('reservation/:id')
    @ApiOperation({ summary: 'Mettre à jour une réservation (Admin)' })
    updateReservation(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.crecheService.updateReservation(id, data);
    }

    @Delete('reservation/:id')
    @ApiOperation({ summary: 'Supprimer une réservation (Admin)' })
    deleteReservation(@Param('id', ParseIntPipe) id: number) {
        return this.crecheService.deleteReservation(id);
    }

    @Get('planning')
    @ApiOperation({ summary: 'Planning du jour : présents, absents, places disponibles (date=YYYY-MM-DD)' })
    getPlanningJour(@Query('date') date: string) {
        return this.crecheService.getPlanningJour(date);
    }

    @Post('absence')
    @ApiOperation({ summary: 'Signaler une absence sur une inscription régulière' })
    createAbsence(@Body() dto: CreateAbsenceDto) {
        return this.crecheService.createAbsence(dto);
    }

    @Get('inscription/:id/absences')
    @ApiOperation({ summary: 'Récupérer les absences d\'une inscription' })
    getAbsencesByInscription(@Param('id', ParseIntPipe) id: number) {
        return this.crecheService.getAbsencesByInscription(id);
    }

    @Delete('absence/:id')
    @ApiOperation({ summary: 'Supprimer une absence' })
    deleteAbsence(@Param('id', ParseIntPipe) id: number) {
        return this.crecheService.deleteAbsence(id);
    }
}
