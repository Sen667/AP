import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContratGardeDto } from './dto/create-contrat-garde.dto';
import { UpdateContratGardeDto } from './dto/update-contrat-garde.dto';

@Injectable()
export class ContratGardeService {
    constructor(private readonly prismaService: PrismaService) { }

    private async getParentProfilId(userId: number): Promise<number> {
        const parentProfil = await this.prismaService.parentProfil.findUnique({
            where: { utilisateurId: userId },
            select: { id: true },
        });

        if (!parentProfil) {
            throw new NotFoundException(`Profil parent introuvable pour l'utilisateur ${userId}`);
        }

        return parentProfil.id;
    }

    private async getAssistantProfilId(userId: number): Promise<number> {
        const assistantProfil = await this.prismaService.assistantProfil.findUnique({
            where: { utilisateurId: userId },
            select: { id: true },
        });

        if (!assistantProfil) {
            throw new NotFoundException(`Profil assistant introuvable pour l'utilisateur ${userId}`);
        }

        return assistantProfil.id;
    }

    private async getParametreLegal(nom: string): Promise<number | null> {
        const maintenant = new Date();

        const parametre = await this.prismaService.parametreLegal.findFirst({
            where: {
                nom,
                dateMiseEnVigueur: { lte: maintenant },
                OR: [
                    { dateFinVigueur: null },
                    { dateFinVigueur: { gte: maintenant } }
                ]
            },
            orderBy: {
                dateMiseEnVigueur: 'desc'
            }
        });

        return parametre ? Number(parametre.valeur) : null;
    }

    async create(createContratGardeDto: CreateContratGardeDto, userId: number) {
        const parentId = await this.getParentProfilId(userId);

        // Vérifier que l'assistante ne dépasse pas 45h par semaine
        await this.verifierHeuresAssistante(
            createContratGardeDto.assistantId,
            createContratGardeDto.nombreHeuresSemaine
        );

        return this.prismaService.contratGarde.create({
            data: {
                ...createContratGardeDto,
                dateDebut: new Date(createContratGardeDto.dateDebut),
                dateFin: createContratGardeDto.dateFin ? new Date(createContratGardeDto.dateFin) : null,
                parentId,
                statut: 'EN_ATTENTE_VALIDATION',
            },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });
    }

    private async verifierHeuresAssistante(assistantId: number, heuresNouveau: number, contratIdExclu?: number) {
        // Récupérer le nombre maximum d'heures depuis les paramètres légaux
        const HEURES_MAXIMUM_SEMAINE = await this.getParametreLegal('HEURES_SEMAINE_MAXIMUM');

        if (!HEURES_MAXIMUM_SEMAINE) {
            throw new BadRequestException(
                'Le paramètre HEURES_SEMAINE_MAXIMUM n\'est pas configuré dans la base de données.'
            );
        }

        // Récupérer tous les contrats actifs et en attente de validation de l'assistante
        const contratsExistants = await this.prismaService.contratGarde.findMany({
            where: {
                assistantId,
                statut: {
                    in: ['ACTIF', 'EN_ATTENTE_VALIDATION']
                },
                ...(contratIdExclu ? { id: { not: contratIdExclu } } : {})
            },
            select: {
                nombreHeuresSemaine: true,
                enfant: {
                    select: {
                        prenom: true,
                        nom: true
                    }
                }
            }
        });

        // Calculer le total des heures
        const heuresActuelles = contratsExistants.reduce(
            (total, contrat) => total + Number(contrat.nombreHeuresSemaine),
            0
        );

        const heuresTotal = heuresActuelles + heuresNouveau;

        if (heuresTotal > HEURES_MAXIMUM_SEMAINE) {
            const heuresDisponibles = HEURES_MAXIMUM_SEMAINE - heuresActuelles;
            throw new BadRequestException(
                `L'assistante a déjà ${heuresActuelles}h par semaine de contrats. ` +
                `Maximum légal : ${HEURES_MAXIMUM_SEMAINE}h. ` +
                `Heures disponibles : ${heuresDisponibles}h.`
            );
        }
    }

    async findAllByParent(userId: number) {
        const parentId = await this.getParentProfilId(userId);

        return this.prismaService.contratGarde.findMany({
            where: { parentId },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findAllByEnfant(enfantId: number, userId: number) {
        const parentId = await this.getParentProfilId(userId);

        return this.prismaService.contratGarde.findMany({
            where: {
                enfantId,
                parentId,
            },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: number, userId: number) {
        // Vérifier si l'utilisateur est admin
        const utilisateur = await this.prismaService.utilisateur.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!utilisateur) {
            throw new NotFoundException(`Utilisateur ${userId} introuvable`);
        }

        const isAdmin = utilisateur.role === 'ADMIN';

        // Si admin, récupérer le contrat sans vérification de propriété
        if (isAdmin) {
            const contrat = await this.prismaService.contratGarde.findUnique({
                where: { id },
                include: {
                    enfant: true,
                    assistant: {
                        include: {
                            utilisateur: true,
                        },
                    },
                    parent: {
                        include: {
                            utilisateur: true,
                        },
                    },
                },
            });

            if (!contrat) {
                throw new NotFoundException(`Contrat de garde avec l'ID ${id} introuvable`);
            }

            return contrat;
        }

        // Sinon, vérifier que c'est le parent propriétaire
        const parentId = await this.getParentProfilId(userId);

        const contrat = await this.prismaService.contratGarde.findFirst({
            where: {
                id,
                parentId,
            },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });

        if (!contrat) {
            throw new NotFoundException(`Contrat de garde avec l'ID ${id} introuvable`);
        }

        return contrat;
    }

    async update(id: number, updateContratGardeDto: UpdateContratGardeDto, userId: number) {
        // Vérifier le rôle de l'utilisateur
        const utilisateur = await this.prismaService.utilisateur.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!utilisateur) {
            throw new NotFoundException(`Utilisateur ${userId} introuvable`);
        }

        const isAdmin = utilisateur.role === 'ADMIN';

        // Vérifier que le contrat existe (et appartient au parent si pas admin)
        const contrat = isAdmin
            ? await this.prismaService.contratGarde.findUnique({ where: { id } })
            : await this.findOne(id, userId);

        if (!contrat) {
            throw new NotFoundException(`Contrat de garde avec l'ID ${id} introuvable`);
        }

        // Vérifier les heures de l'assistante si le nombre d'heures change
        if (updateContratGardeDto.nombreHeuresSemaine !== undefined &&
            updateContratGardeDto.nombreHeuresSemaine !== Number(contrat.nombreHeuresSemaine)) {
            await this.verifierHeuresAssistante(
                contrat.assistantId,
                updateContratGardeDto.nombreHeuresSemaine,
                id // Exclure le contrat actuel du calcul
            );
        }

        // Si le contrat a déjà été validé, le remettre en attente de validation après modification
        const updateData: UpdateContratGardeDto | any = {
            ...updateContratGardeDto,
            dateDebut: updateContratGardeDto.dateDebut ? new Date(updateContratGardeDto.dateDebut) : undefined,
            dateFin: updateContratGardeDto.dateFin ? new Date(updateContratGardeDto.dateFin) : undefined,
        };

        // Si le contrat était validé, le remettre en attente de validation (sauf si admin)
        if (contrat.statut === 'ACTIF' && !isAdmin) {
            updateData.statut = 'EN_ATTENTE_VALIDATION';
        }

        return this.prismaService.contratGarde.update({
            where: { id },
            data: updateData,
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });
    }

    async remove(id: number, userId: number) {
        // Vérifier le rôle de l'utilisateur
        const utilisateur = await this.prismaService.utilisateur.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!utilisateur) {
            throw new NotFoundException(`Utilisateur ${userId} introuvable`);
        }

        const isAdmin = utilisateur.role === 'ADMIN';

        // Vérifier que le contrat existe (et appartient au parent si pas admin)
        if (!isAdmin) {
            await this.findOne(id, userId);
        } else {
            const contrat = await this.prismaService.contratGarde.findUnique({ where: { id } });
            if (!contrat) {
                throw new NotFoundException(`Contrat de garde avec l'ID ${id} introuvable`);
            }
        }

        return this.prismaService.contratGarde.delete({
            where: { id },
        });
    }

    async findAllByAssistant(userId: number) {
        const assistantId = await this.getAssistantProfilId(userId);

        return this.prismaService.contratGarde.findMany({
            where: { assistantId },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOneByAssistant(id: number, userId: number) {
        // Vérifier que le contrat existe et est lié à l'assistante
        const assistantId = await this.getAssistantProfilId(userId);

        const contrat = await this.prismaService.contratGarde.findFirst({
            where: {
                id,
                assistantId,
            },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });

        if (!contrat) {
            throw new NotFoundException(`Contrat de garde avec l'ID ${id} introuvable`);
        }

        return contrat;
    }

    async accepterContrat(id: number, userId: number) {
        // Vérifier que le contrat existe et est lié à l'assistante
        const contrat = await this.findOneByAssistant(id, userId);

        if (contrat.statut !== 'EN_ATTENTE_VALIDATION') {
            throw new BadRequestException(`Ce contrat a déjà été traité`);
        }

        return this.prismaService.contratGarde.update({
            where: { id },
            data: {
                statut: 'ACTIF',
            },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });
    }

    async refuserContrat(id: number, userId: number) {
        // Vérifier que le contrat existe et est lié à l'assistante
        const contrat = await this.findOneByAssistant(id, userId);

        if (contrat.statut !== 'EN_ATTENTE_VALIDATION') {
            throw new BadRequestException(`Ce contrat a déjà été traité`);
        }

        return this.prismaService.contratGarde.update({
            where: { id },
            data: {
                statut: 'TERMINE',
            },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.prismaService.contratGarde.findMany({
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getEnfantsGardesParAssistant(assistantId: number) {
        const contrats = await this.prismaService.contratGarde.findMany({
            where: {
                assistantId,
                statut: {
                    in: ['ACTIF', 'EN_ATTENTE_VALIDATION'],
                },
            },
            include: {
                enfant: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return contrats.map(contrat => contrat.enfant);
    }

    async getHeuresDisponibles(assistantId: number) {
        // Récupérer le nombre maximum d'heures depuis les paramètres légaux
        const HEURES_MAXIMUM_SEMAINE = await this.getParametreLegal('HEURES_SEMAINE_MAXIMUM');

        if (!HEURES_MAXIMUM_SEMAINE) {
            throw new BadRequestException(
                'Le paramètre HEURES_SEMAINE_MAXIMUM n\'est pas configuré dans la base de données.'
            );
        }

        // Récupérer tous les contrats actifs et en attente de validation de l'assistante
        const contratsExistants = await this.prismaService.contratGarde.findMany({
            where: {
                assistantId,
                statut: {
                    in: ['ACTIF', 'EN_ATTENTE_VALIDATION']
                },
            },
            select: {
                nombreHeuresSemaine: true,
            }
        });

        // Calculer le total des heures
        const heuresActuelles = contratsExistants.reduce(
            (total, contrat) => total + Number(contrat.nombreHeuresSemaine),
            0
        );

        const heuresDisponibles = HEURES_MAXIMUM_SEMAINE - heuresActuelles;

        return {
            heuresActuelles,
            heuresMaximum: HEURES_MAXIMUM_SEMAINE,
            heuresDisponibles: Math.max(0, heuresDisponibles),
        };
    }

    /**
     * Demander la révocation d'un contrat (côté assistante)
     */
    async demanderRevocation(id: number, userId: number, motif: string) {
        // Vérifier que le contrat existe et appartient à l'assistante
        const contrat = await this.findOneByAssistant(id, userId);

        // Vérifier que le contrat est actif
        if (contrat.statut !== 'ACTIF') {
            throw new BadRequestException(
                'Seuls les contrats actifs peuvent faire l\'objet d\'une demande de révocation'
            );
        }

        // Vérifier qu'il n'y a pas déjà une demande en cours
        if (contrat.revocationStatut === 'EN_ATTENTE') {
            throw new BadRequestException(
                'Une demande de révocation est déjà en cours pour ce contrat'
            );
        }

        return this.prismaService.contratGarde.update({
            where: { id },
            data: {
                revocationDemandeePar: 'ASSISTANT',
                revocationStatut: 'EN_ATTENTE',
                revocationDateDemande: new Date(),
                revocationMotif: motif,
            },
            include: {
                enfant: true,
                assistant: {
                    include: {
                        utilisateur: true,
                    },
                },
                parent: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });
    }

    /**
     * Traiter une demande de révocation (côté parent)
     */
    async traiterRevocationParent(
        id: number,
        userId: number,
        accepter: boolean,
        commentaire?: string
    ) {
        // Vérifier que le contrat existe et appartient au parent
        const contrat = await this.findOne(id, userId);

        // Vérifier qu'il y a bien une demande de révocation en attente
        if (contrat.revocationStatut !== 'EN_ATTENTE') {
            throw new BadRequestException(
                'Aucune demande de révocation en attente pour ce contrat'
            );
        }

        // Si accepté : marquer le contrat comme TERMINE
        // Si refusé : remettre les champs de révocation à null
        if (accepter) {
            return this.prismaService.contratGarde.update({
                where: { id },
                data: {
                    statut: 'TERMINE',
                    revocationStatut: 'VALIDE',
                    revocationDateValidation: new Date(),
                    revocationCommentaireParent: commentaire,
                },
                include: {
                    enfant: true,
                    assistant: {
                        include: {
                            utilisateur: true,
                        },
                    },
                    parent: {
                        include: {
                            utilisateur: true,
                        },
                    },
                },
            });
        } else {
            return this.prismaService.contratGarde.update({
                where: { id },
                data: {
                    revocationStatut: 'REFUSE',
                    revocationDateValidation: new Date(),
                    revocationCommentaireParent: commentaire,
                },
                include: {
                    enfant: true,
                    assistant: {
                        include: {
                            utilisateur: true,
                        },
                    },
                    parent: {
                        include: {
                            utilisateur: true,
                        },
                    },
                },
            });
        }
    }
}
