import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { CreateInscriptionDto } from './dto/create-inscription.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JourSemaine, TypeAccueilCreche, StatutValidation } from 'generated/types';

@Injectable()
export class CrecheService {
    constructor(private readonly prisma: PrismaService) { }

    private getJourSemaine(date: Date): JourSemaine {
        const jours: JourSemaine[] = [
            JourSemaine.DIMANCHE,
            JourSemaine.LUNDI,
            JourSemaine.MARDI,
            JourSemaine.MERCREDI,
            JourSemaine.JEUDI,
            JourSemaine.VENDREDI,
            JourSemaine.SAMEDI,
        ];
        return jours[date.getDay()];
    }

    async checkPlacesDisponibles(date: Date): Promise<number> {
        const paramStructure = await this.prisma.parametreStructure.findFirst();
        const capacite = paramStructure?.capaciteCreche || 10; // Default capacity

        const jourSemaine = this.getJourSemaine(date);
        date.setHours(0, 0, 0, 0);

        // 1. Regular inscriptions active on this date and day of week, excluding those with an absence covering the date
        const reguliers = await this.prisma.inscriptionCreche.count({
            where: {
                typeAccueil: TypeAccueilCreche.REGULIER,
                dateDebut: { lte: date },
                OR: [{ dateFin: null }, { dateFin: { gte: date } }],
                statut: 'ACTIVE',
                jours: {
                    some: { jourSemaine: jourSemaine },
                },
                NOT: {
                    absences: {
                        some: {
                            dateDebut: { lte: date },
                            dateFin: { gte: date },
                        },
                    },
                },
            },
        });

        // 2. Reservations (occasional or explicit) on this exact date
        const occasionnels = await this.prisma.reservationCreche.count({
            where: {
                date: date,
                statut: { in: [StatutValidation.EN_ATTENTE, StatutValidation.VALIDE] },
            },
        });

        const placesDisponibles = capacite - (reguliers + occasionnels);
        return placesDisponibles > 0 ? placesDisponibles : 0;
    }

    async createInscription(dto: CreateInscriptionDto) {
        const parentProfil = await this.prisma.parentProfil.findUnique({ where: { utilisateurId: dto.parentId } });
        if (!parentProfil) throw new BadRequestException('Profil parent introuvable.');

        const { jours, parentId, ...data } = dto;
        return this.prisma.inscriptionCreche.create({
            data: {
                ...data,
                parentId: parentProfil.id,
                jours: dto.typeAccueil === TypeAccueilCreche.REGULIER && jours ? {
                    create: jours.map(jour => ({ jourSemaine: jour }))
                } : undefined,
            },
            include: { jours: true, enfant: true }
        });
    }

    async createReservation(dto: CreateReservationDto) {
        const parentProfil = await this.prisma.parentProfil.findUnique({ where: { utilisateurId: dto.parentId } });
        if (!parentProfil) throw new BadRequestException('Profil parent introuvable.');

        const dateReservation = new Date(dto.date);
        dateReservation.setHours(0, 0, 0, 0);

        // Check 24 hours in advance rule
        const now = new Date();
        const timeDiffHours = (dateReservation.getTime() - now.getTime()) / (1000 * 60 * 60);

        const realDateArrival = new Date(dto.date);
        const msSinceMidnight = dto.arriveeMinutes * 60000;
        realDateArrival.setTime(dateReservation.getTime() + msSinceMidnight);
        const realDiffHours = (realDateArrival.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (realDiffHours < 24) {
            throw new BadRequestException('La réservation doit se faire au moins 24 heures à l\'avance.');
        }

        const dispo = await this.checkPlacesDisponibles(dateReservation);
        if (dispo <= 0) {
            throw new BadRequestException('Aucune place disponible pour cette date.');
        }

        const montant = dto.montant || 0;

        return this.prisma.reservationCreche.create({
            data: {
                ...dto,
                parentId: parentProfil.id,
                date: dateReservation,
                montant,
            },
            include: { enfant: true },
        });
    }

    async getInscriptionsByParent(userId: number) {
        const parentProfil = await this.prisma.parentProfil.findUnique({ where: { utilisateurId: userId } });
        if (!parentProfil) return [];
        return this.prisma.inscriptionCreche.findMany({
            where: { parentId: parentProfil.id },
            include: {
                enfant: true,
                jours: true,
            }
        });
    }

    async getAllInscriptions() {
        return this.prisma.inscriptionCreche.findMany({
            include: {
                enfant: true,
                parent: true,
                jours: true,
            },
            orderBy: { dateDebut: 'desc' }
        });
    }

    async getReservationsByParent(userId: number) {
        const parentProfil = await this.prisma.parentProfil.findUnique({ where: { utilisateurId: userId } });
        if (!parentProfil) return [];
        return this.prisma.reservationCreche.findMany({
            where: { parentId: parentProfil.id },
            include: {
                enfant: true,
            },
            orderBy: { date: 'desc' }
        });
    }

    async getAllReservations() {
        return this.prisma.reservationCreche.findMany({
            include: {
                enfant: true,
                parent: true,
            },
            orderBy: { date: 'desc' }
        });
    }

    async updateInscription(id: number, data: any) {
        if (data.parentId) {
            const parentProfil = await this.prisma.parentProfil.findUnique({ where: { utilisateurId: data.parentId } });
            if (parentProfil) data.parentId = parentProfil.id;
        }
        if (data.dateDebut) data.dateDebut = new Date(data.dateDebut);
        if (data.dateFin) data.dateFin = new Date(data.dateFin);

        return this.prisma.inscriptionCreche.update({
            where: { id },
            data,
        });
    }

    async deleteInscription(id: number) {
        return this.prisma.inscriptionCreche.delete({
            where: { id },
        });
    }

    async updateReservation(id: number, data: any) {
        if (data.parentId) {
            const parentProfil = await this.prisma.parentProfil.findUnique({ where: { utilisateurId: data.parentId } });
            if (parentProfil) data.parentId = parentProfil.id;
        }
        if (data.date) data.date = new Date(data.date);

        return this.prisma.reservationCreche.update({
            where: { id },
            data,
        });
    }

    async deleteReservation(id: number) {
        return this.prisma.reservationCreche.delete({
            where: { id },
        });
    }

    async createAbsence(dto: CreateAbsenceDto) {
        const inscription = await this.prisma.inscriptionCreche.findUnique({
            where: { id: dto.inscriptionId },
        });
        if (!inscription) throw new NotFoundException('Inscription introuvable.');

        const dateDebut = new Date(dto.dateDebut);
        const dateFin = new Date(dto.dateFin);
        dateDebut.setHours(0, 0, 0, 0);
        dateFin.setHours(23, 59, 59, 999);

        if (dateFin < dateDebut) {
            throw new BadRequestException('La date de fin doit être après la date de début.');
        }

        return this.prisma.absenceCreche.create({
            data: {
                inscriptionId: dto.inscriptionId,
                dateDebut,
                dateFin,
                motif: dto.motif,
            },
        });
    }

    async getAbsencesByInscription(inscriptionId: number) {
        return this.prisma.absenceCreche.findMany({
            where: { inscriptionId },
            orderBy: { dateDebut: 'desc' },
        });
    }

    async deleteAbsence(id: number) {
        const absence = await this.prisma.absenceCreche.findUnique({ where: { id } });
        if (!absence) throw new NotFoundException('Absence introuvable.');
        return this.prisma.absenceCreche.delete({ where: { id } });
    }

    async getPlanningJour(dateStr: string) {
        const date = new Date(dateStr);
        date.setUTCHours(0, 0, 0, 0);
        const jourSemaine = this.getJourSemaine(date);

        const paramStructure = await this.prisma.parametreStructure.findFirst();
        const capacite = paramStructure?.capaciteCreche ?? 10;

        // Inscriptions régulières actives ce jour, avec leurs absences éventuelles
        const inscriptionsActives = await this.prisma.inscriptionCreche.findMany({
            where: {
                typeAccueil: TypeAccueilCreche.REGULIER,
                dateDebut: { lte: date },
                OR: [{ dateFin: null }, { dateFin: { gte: date } }],
                statut: 'ACTIVE',
                jours: { some: { jourSemaine } },
            },
            include: {
                enfant: true,
                absences: {
                    where: {
                        dateDebut: { lte: date },
                        dateFin: { gte: date },
                    },
                },
            },
        });

        const reguliersPresents = inscriptionsActives.filter(i => i.absences.length === 0);
        const reguliersAbsents = inscriptionsActives.filter(i => i.absences.length > 0);

        // Réservations occasionnelles validées/en attente pour cette date
        const reservationsOccasionnelles = await this.prisma.reservationCreche.findMany({
            where: {
                date,
                statut: { in: [StatutValidation.EN_ATTENTE, StatutValidation.VALIDE] },
            },
            include: { enfant: true },
        });

        const nbPresents = reguliersPresents.length + reservationsOccasionnelles.length;
        const placesDisponibles = Math.max(0, capacite - nbPresents);

        const minutesToHeure = (m: number) => {
            const h = Math.floor(m / 60).toString().padStart(2, '0');
            const min = (m % 60).toString().padStart(2, '0');
            return `${h}:${min}`;
        };

        return {
            date: dateStr,
            totalCapacite: capacite,
            nbPresents,
            placesDisponibles,
            nbAbsences: reguliersAbsents.length,
            presents: [
                ...reguliersPresents.map(i => ({
                    nom: i.enfant.nom,
                    prenom: i.enfant.prenom,
                    type: 'RÉGULIER',
                    horaires: '—',
                })),
                ...reservationsOccasionnelles.map(r => ({
                    nom: r.enfant.nom,
                    prenom: r.enfant.prenom,
                    type: 'OCCASIONNEL',
                    horaires: `${minutesToHeure(r.arriveeMinutes)} - ${minutesToHeure(r.departMinutes)}`,
                })),
            ],
            absents: reguliersAbsents.map(i => ({
                nom: i.enfant.nom,
                prenom: i.enfant.prenom,
                motif: i.absences[0]?.motif ?? '—',
            })),
        };
    }
}
