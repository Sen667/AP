import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuiviJournalierDto } from './dto/create-suivi-journalier.dto';
import { UpdateSuiviJournalierDto } from './dto/update-suivi-journalier.dto';

@Injectable()
export class SuiviJournalierService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Crée ou met à jour un suivi journalier
     * Adapte les données détaillées du frontend au schéma existant
     */
    async createOrUpdate(assistantId: number, dto: CreateSuiviJournalierDto) {
        // Vérifier que l'enfant existe
        const enfant = await this.prisma.enfant.findUnique({
            where: { id: dto.enfantId },
        });

        if (!enfant) {
            throw new NotFoundException(`Enfant avec l'ID ${dto.enfantId} non trouvé`);
        }

        // Vérifier que l'assistant a un contrat actif avec cet enfant
        const contratActif = await this.prisma.contratGarde.findFirst({
            where: {
                enfantId: dto.enfantId,
                assistantId: assistantId,
                statut: 'ACTIF',
            },
        });

        if (!contratActif) {
            throw new ForbiddenException(
                "Vous n'avez pas de contrat actif avec cet enfant",
            );
        }

        // Adapter les données au schéma existant
        const dateObj = new Date(dto.date);

        // Construire les champs adaptés
        const repasData = this.buildRepasString(dto);
        const siesteData = this.buildSiesteString(dto);
        const remarquesData = this.buildRemarquesString(dto);

        // Créer ou mettre à jour le suivi
        const suivi = await this.prisma.suiviJournalierEnfant.upsert({
            where: {
                enfantId_date: {
                    enfantId: dto.enfantId,
                    date: dateObj,
                },
            },
            create: {
                enfantId: dto.enfantId,
                assistantId: assistantId,
                date: dateObj,
                temperature: dto.temperature || null,
                humeur: dto.humeur || null,
                repas: repasData,
                sieste: siesteData,
                remarques: remarquesData,
            },
            update: {
                temperature: dto.temperature || null,
                humeur: dto.humeur || null,
                repas: repasData,
                sieste: siesteData,
                remarques: remarquesData,
            },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: {
                            select: {
                                id: true,
                                prenom: true,
                                nom: true,
                            },
                        },
                    },
                },
            },
        });

        // Retourner les données enrichies pour le frontend
        return this.enrichSuiviData(suivi, dto);
    }

    /**
     * Récupère un suivi journalier spécifique
     */
    async findOne(enfantId: number, date: string, userId: number, userRole: string) {
        const dateObj = new Date(date);

        const suivi = await this.prisma.suiviJournalierEnfant.findUnique({
            where: {
                enfantId_date: {
                    enfantId: enfantId,
                    date: dateObj,
                },
            },
            include: {
                enfant: {
                    include: {
                        parents: {
                            include: {
                                parent: {
                                    include: {
                                        utilisateur: true,
                                    },
                                },
                            },
                        },
                    },
                },
                assistant: {
                    include: {
                        utilisateur: {
                            select: {
                                id: true,
                                prenom: true,
                                nom: true,
                            },
                        },
                    },
                },
            },
        });

        if (!suivi) {
            throw new NotFoundException('Suivi journalier non trouvé');
        }

        // Vérifier les permissions
        await this.checkPermissions(suivi, userId, userRole);

        // Déconstruire les données pour le frontend
        return this.deconstructSuiviData(suivi);
    }

    /**
     * Récupère tous les suivis d'un enfant
     */
    async findByEnfant(enfantId: number, userId: number, userRole: string) {
        // Vérifier que l'enfant existe
        const enfant = await this.prisma.enfant.findUnique({
            where: { id: enfantId },
            include: {
                parents: {
                    include: {
                        parent: {
                            include: {
                                utilisateur: true,
                            },
                        },
                    },
                },
            },
        });

        if (!enfant) {
            throw new NotFoundException(`Enfant avec l'ID ${enfantId} non trouvé`);
        }

        // Vérifier les permissions (parent de l'enfant ou assistant avec contrat)
        if (userRole === 'PARENT') {
            const isParent = enfant.parents.some(
                (lien) => lien.parent.utilisateur.id === userId,
            );
            if (!isParent) {
                throw new ForbiddenException("Vous n'êtes pas le parent de cet enfant");
            }
        } else if (userRole === 'ASSISTANT') {
            const assistantProfil = await this.prisma.assistantProfil.findUnique({
                where: { utilisateurId: userId },
            });

            if (!assistantProfil) {
                throw new ForbiddenException('Profil assistant non trouvé');
            }

            const contrat = await this.prisma.contratGarde.findFirst({
                where: {
                    enfantId: enfantId,
                    assistantId: assistantProfil.id,
                },
            });

            if (!contrat) {
                throw new ForbiddenException(
                    "Vous n'avez pas de contrat avec cet enfant",
                );
            }
        }

        // Récupérer les suivis (limiter aux 30 derniers jours par défaut)
        const suivis = await this.prisma.suiviJournalierEnfant.findMany({
            where: {
                enfantId: enfantId,
            },
            include: {
                assistant: {
                    include: {
                        utilisateur: {
                            select: {
                                id: true,
                                prenom: true,
                                nom: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
            take: 60,
        });

        // Déconstruire les données pour chaque suivi
        return suivis.map((suivi) => this.deconstructSuiviData(suivi));
    }

    /**
     * Récupère les enfants d'un assistant (via contrats actifs)
     */
    async getEnfantsForAssistant(userId: number) {
        const assistantProfil = await this.prisma.assistantProfil.findUnique({
            where: { utilisateurId: userId },
        });

        if (!assistantProfil) {
            throw new NotFoundException('Profil assistant non trouvé');
        }

        const contrats = await this.prisma.contratGarde.findMany({
            where: {
                assistantId: assistantProfil.id,
                statut: 'ACTIF',
            },
            include: {
                enfant: true,
            },
            distinct: ['enfantId'],
        });

        return contrats.map((contrat) => contrat.enfant);
    }

    /**
     * Construit la chaîne de repas à partir des données détaillées
     */
    private buildRepasString(dto: CreateSuiviJournalierDto): string | null {
        const parts: string[] = [];

        if (dto.repasHoraires) {
            parts.push(`Horaires: ${dto.repasHoraires}`);
        }

        if (dto.repasAliments) {
            parts.push(`Aliments: ${dto.repasAliments}`);
        }

        return parts.length > 0 ? parts.join(' | ') : null;
    }

    /**
     * Construit la chaîne de sieste à partir des données détaillées
     */
    private buildSiesteString(dto: CreateSuiviJournalierDto): string | null {
        if (dto.dodoDeb && dto.dodoFin) {
            return `${dto.dodoDeb} - ${dto.dodoFin}`;
        } else if (dto.dodoDeb) {
            return `Début: ${dto.dodoDeb}`;
        } else if (dto.dodoFin) {
            return `Fin: ${dto.dodoFin}`;
        }
        return null;
    }

    /**
     * Construit la chaîne de remarques incluant toutes les infos supplémentaires
     */
    private buildRemarquesString(dto: CreateSuiviJournalierDto): string | null {
        const sections: string[] = [];

        if (dto.pleurs) {
            sections.push(`Pleurs: ${dto.pleurs}`);
        }

        if (dto.besoins) {
            sections.push(`Besoins: ${dto.besoins}`);
        }

        if (dto.activites) {
            sections.push(`Activités: ${dto.activites}`);
        }

        if (dto.promenadeHoraires) {
            sections.push(`Promenades: ${dto.promenadeHoraires}`);
        }

        if (dto.remarques) {
            sections.push(`Remarques: ${dto.remarques}`);
        }

        return sections.length > 0 ? sections.join('\n\n') : null;
    }

    /**
     * Enrichit les données du suivi avec les informations détaillées du DTO
     */
    private enrichSuiviData(suivi: any, dto: CreateSuiviJournalierDto) {
        return {
            id: suivi.id,
            enfantId: suivi.enfantId,
            date: suivi.date,
            temperature: suivi.temperature ? parseFloat(suivi.temperature.toString()) : null,
            humeur: suivi.humeur,

            // Données détaillées du DTO
            pleurs: dto.pleurs,
            besoins: dto.besoins,
            repasHoraires: dto.repasHoraires,
            repasAliments: dto.repasAliments,
            dodoDeb: dto.dodoDeb,
            dodoFin: dto.dodoFin,
            activites: dto.activites,
            promenadeHoraires: dto.promenadeHoraires,
            remarques: dto.remarques,

            assistant: suivi.assistant,
        };
    }

    /**
     * Déconstruit les données stockées pour le frontend
     */
    private deconstructSuiviData(suivi: any) {
        // Extraire les informations des champs concaténés
        const repasData = this.parseRepasString(suivi.repas);
        const siesteData = this.parseSiesteString(suivi.sieste);
        const remarquesData = this.parseRemarquesString(suivi.remarques);

        return {
            id: suivi.id,
            enfantId: suivi.enfantId,
            date: suivi.date,
            temperature: suivi.temperature ? parseFloat(suivi.temperature.toString()) : null,
            humeur: suivi.humeur,

            // Données décomposées
            ...repasData,
            ...siesteData,
            ...remarquesData,

            assistant: suivi.assistant,
        };
    }

    /**
     * Parse la chaîne de repas
     */
    private parseRepasString(repas: string | null): any {
        if (!repas) return {};

        const result: any = {};
        const parts = repas.split(' | ');

        parts.forEach((part) => {
            if (part.startsWith('Horaires: ')) {
                result.repasHoraires = part.replace('Horaires: ', '');
            } else if (part.startsWith('Aliments: ')) {
                result.repasAliments = part.replace('Aliments: ', '');
            }
        });

        return result;
    }

    /**
     * Parse la chaîne de sieste
     */
    private parseSiesteString(sieste: string | null): any {
        if (!sieste) return {};

        const result: any = {};

        if (sieste.includes(' - ')) {
            const [deb, fin] = sieste.split(' - ');
            result.dodoDeb = deb;
            result.dodoFin = fin;
        } else if (sieste.startsWith('Début: ')) {
            result.dodoDeb = sieste.replace('Début: ', '');
        } else if (sieste.startsWith('Fin: ')) {
            result.dodoFin = sieste.replace('Fin: ', '');
        }

        return result;
    }

    /**
     * Parse la chaîne de remarques
     */
    private parseRemarquesString(remarques: string | null): any {
        if (!remarques) return {};

        const result: any = {};
        const sections = remarques.split('\n\n');

        sections.forEach((section) => {
            if (section.startsWith('Pleurs: ')) {
                result.pleurs = section.replace('Pleurs: ', '');
            } else if (section.startsWith('Besoins: ')) {
                result.besoins = section.replace('Besoins: ', '');
            } else if (section.startsWith('Activités: ')) {
                result.activites = section.replace('Activités: ', '');
            } else if (section.startsWith('Promenades: ')) {
                result.promenadeHoraires = section.replace('Promenades: ', '');
            } else if (section.startsWith('Remarques: ')) {
                result.remarques = section.replace('Remarques: ', '');
            }
        });

        return result;
    }

    /**
     * Vérifie les permissions d'accès à un suivi
     */
    private async checkPermissions(suivi: any, userId: number, userRole: string) {
        if (userRole === 'ADMIN') {
            return; // Admin a accès à tout
        }

        if (userRole === 'PARENT') {
            const isParent = suivi.enfant.parents.some(
                (lien: any) => lien.parent.utilisateur.id === userId,
            );
            if (!isParent) {
                throw new ForbiddenException("Vous n'êtes pas le parent de cet enfant");
            }
        } else if (userRole === 'ASSISTANT') {
            if (suivi.assistant.utilisateur.id !== userId) {
                throw new ForbiddenException("Vous n'êtes pas l'assistant de cet enfant");
            }
        }
    }
}
