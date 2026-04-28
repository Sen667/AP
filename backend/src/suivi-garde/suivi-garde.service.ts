import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuiviGardeDto } from './dto/create-suivi-garde.dto';
import { UpdateSuiviGardeDto } from './dto/update-suivi-garde.dto';
import { ValiderSuiviGardeDto } from './dto/valider-suivi-garde.dto';

@Injectable()
export class SuiviGardeService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getAssistantProfilId(userId: number): Promise<number> {
    const assistantProfil = await this.prismaService.assistantProfil.findUnique(
      {
        where: { utilisateurId: userId },
        select: { id: true },
      },
    );

    if (!assistantProfil) {
      throw new NotFoundException(
        `Profil assistant introuvable pour l'utilisateur ${userId}`,
      );
    }

    return assistantProfil.id;
  }

  private async getParentProfilId(userId: number): Promise<number> {
    const parentProfil = await this.prismaService.parentProfil.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });

    if (!parentProfil) {
      throw new NotFoundException(
        `Profil parent introuvable pour l'utilisateur ${userId}`,
      );
    }

    return parentProfil.id;
  }

  async create(createSuiviGardeDto: CreateSuiviGardeDto, userId: number) {
    const assistantId = await this.getAssistantProfilId(userId);

    // Vérifier que le contrat existe et appartient à l'assistante
    const contrat = await this.prismaService.contratGarde.findFirst({
      where: {
        id: createSuiviGardeDto.contratId,
        assistantId,
        statut: {
          in: ['ACTIF', 'EN_ATTENTE_VALIDATION'],
        },
      },
    });

    if (!contrat) {
      throw new NotFoundException(
        `Contrat de garde ${createSuiviGardeDto.contratId} introuvable ou non actif`,
      );
    }

    // Vérifier qu'il n'existe pas déjà un suivi pour ce contrat et cette date
    const suiviExistant =
      await this.prismaService.suiviGardeAssistant.findUnique({
        where: {
          contratId_date: {
            contratId: createSuiviGardeDto.contratId,
            date: new Date(createSuiviGardeDto.date),
          },
        },
      });

    if (suiviExistant) {
      throw new BadRequestException(
        `Un suivi existe déjà pour ce contrat à la date du ${createSuiviGardeDto.date}`,
      );
    }

    return this.prismaService.suiviGardeAssistant.create({
      data: {
        contratId: createSuiviGardeDto.contratId,
        date: new Date(createSuiviGardeDto.date),
        arriveeMinutes: createSuiviGardeDto.arriveeMinutes ?? null,
        departMinutes: createSuiviGardeDto.departMinutes ?? null,
        repasFournis: createSuiviGardeDto.repasFournis,
        fraisDivers: createSuiviGardeDto.fraisDivers,
        km: createSuiviGardeDto.km,
        statut: 'EN_ATTENTE',
      },
      include: {
        contrat: {
          include: {
            enfant: true,
            parent: {
              include: {
                utilisateur: true,
              },
            },
            assistant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllByAssistant(userId: number, mois?: number, annee?: number) {
    const assistantId = await this.getAssistantProfilId(userId);

    const whereClause: Record<string, any> = {
      contrat: {
        assistantId,
      },
    };

    // Filtrer par mois et année si fournis
    if (mois && annee) {
      const dateDebut = new Date(annee, mois - 1, 1);
      const dateFin = new Date(annee, mois, 0, 23, 59, 59);
      whereClause.date = {
        gte: dateDebut,
        lte: dateFin,
      };
    }

    return this.prismaService.suiviGardeAssistant.findMany({
      where: whereClause,
      include: {
        contrat: {
          include: {
            enfant: true,
            parent: {
              include: {
                utilisateur: true,
              },
            },
            assistant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findAllByParent(userId: number, mois?: number, annee?: number) {
    const parentId = await this.getParentProfilId(userId);

    const whereClause: Record<string, any> = {
      contrat: {
        parentId,
      },
    };

    // Filtrer par mois et année si fournis
    if (mois && annee) {
      const dateDebut = new Date(annee, mois - 1, 1);
      const dateFin = new Date(annee, mois, 0, 23, 59, 59);
      whereClause.date = {
        gte: dateDebut,
        lte: dateFin,
      };
    }

    return this.prismaService.suiviGardeAssistant.findMany({
      where: whereClause,
      include: {
        contrat: {
          include: {
            enfant: true,
            parent: {
              include: {
                utilisateur: true,
              },
            },
            assistant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOneByAssistant(id: number, userId: number) {
    const assistantId = await this.getAssistantProfilId(userId);

    const suivi = await this.prismaService.suiviGardeAssistant.findFirst({
      where: {
        id,
        contrat: {
          assistantId,
        },
      },
      include: {
        contrat: {
          include: {
            enfant: true,
            parent: {
              include: {
                utilisateur: true,
              },
            },
            assistant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
    });

    if (!suivi) {
      throw new NotFoundException(`Suivi de garde ${id} introuvable`);
    }

    return suivi;
  }

  async findOneByParent(id: number, userId: number) {
    const parentId = await this.getParentProfilId(userId);

    const suivi = await this.prismaService.suiviGardeAssistant.findFirst({
      where: {
        id,
        contrat: {
          parentId,
        },
      },
      include: {
        contrat: {
          include: {
            enfant: true,
            parent: {
              include: {
                utilisateur: true,
              },
            },
            assistant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
    });

    if (!suivi) {
      throw new NotFoundException(`Suivi de garde ${id} introuvable`);
    }

    return suivi;
  }

  async update(
    id: number,
    updateSuiviGardeDto: UpdateSuiviGardeDto,
    userId: number,
  ) {
    // Vérifier que le suivi existe et appartient à l'assistante
    const suivi = await this.findOneByAssistant(id, userId);

    // Si le suivi a déjà été validé, interdire la modification
    if (suivi.statut === 'VALIDE') {
      throw new BadRequestException(
        'Ce suivi a déjà été validé par le parent et ne peut plus être modifié',
      );
    }

    return this.prismaService.suiviGardeAssistant.update({
      where: { id },
      data: {
        arriveeMinutes: updateSuiviGardeDto.arriveeMinutes,
        departMinutes: updateSuiviGardeDto.departMinutes,
        repasFournis: updateSuiviGardeDto.repasFournis,
        fraisDivers: updateSuiviGardeDto.fraisDivers,
        km: updateSuiviGardeDto.km,
      },
      include: {
        contrat: {
          include: {
            enfant: true,
            parent: {
              include: {
                utilisateur: true,
              },
            },
            assistant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    // Vérifier que le suivi existe et appartient à l'assistante
    const suivi = await this.findOneByAssistant(id, userId);

    // Si le suivi a déjà été validé, interdire la suppression
    if (suivi.statut === 'VALIDE') {
      throw new BadRequestException(
        'Ce suivi a déjà été validé par le parent et ne peut plus être supprimé',
      );
    }

    return this.prismaService.suiviGardeAssistant.delete({
      where: { id },
    });
  }

  async validerSuivi(
    id: number,
    validerDto: ValiderSuiviGardeDto,
    userId: number,
  ) {
    const parentId = await this.getParentProfilId(userId);

    // Vérifier que le suivi existe et appartient au parent
    const suivi = await this.findOneByParent(id, userId);

    // Vérifier que le suivi est en attente
    if (suivi.statut !== 'EN_ATTENTE') {
      throw new BadRequestException(
        'Ce suivi a déjà été validé ou refusé et ne peut plus être modifié',
      );
    }

    // Détecter les modifications pour créer l'historique
    const hasModifications =
      (validerDto.arriveeMinutes !== undefined &&
        validerDto.arriveeMinutes !== suivi.arriveeMinutes) ||
      (validerDto.departMinutes !== undefined &&
        validerDto.departMinutes !== suivi.departMinutes) ||
      (validerDto.repasFournis !== undefined &&
        validerDto.repasFournis !== suivi.repasFournis) ||
      (validerDto.fraisDivers !== undefined &&
        validerDto.fraisDivers !== suivi.fraisDivers?.toNumber()) ||
      (validerDto.km !== undefined && validerDto.km !== suivi.km?.toNumber());

    // Créer un historique pour tracer la validation/refus et les modifications éventuelles
    await this.prismaService.historique.create({
      data: {
        entityType: 'SUIVI_GARDE',
        entityId: id,
        modifieParParentId: parentId,
        action: 'MODIFICATION',
        beforeData: hasModifications
          ? {
              arriveeMinutes: suivi.arriveeMinutes,
              departMinutes: suivi.departMinutes,
              repasFournis: suivi.repasFournis,
              fraisDivers: suivi.fraisDivers?.toNumber(),
              km: suivi.km?.toNumber(),
              statut: suivi.statut,
            }
          : {
              statut: suivi.statut,
            },
        afterData: {
          arriveeMinutes: validerDto.arriveeMinutes ?? suivi.arriveeMinutes,
          departMinutes: validerDto.departMinutes ?? suivi.departMinutes,
          repasFournis: validerDto.repasFournis ?? suivi.repasFournis,
          fraisDivers: validerDto.fraisDivers ?? suivi.fraisDivers?.toNumber(),
          km: validerDto.km ?? suivi.km?.toNumber(),
          statut: validerDto.statut,
          commentaire: validerDto.commentaireParent,
        },
        suiviGardeAssistantId: id,
      },
    });

    return this.prismaService.suiviGardeAssistant.update({
      where: { id },
      data: {
        arriveeMinutes: validerDto.arriveeMinutes,
        departMinutes: validerDto.departMinutes,
        repasFournis: validerDto.repasFournis,
        fraisDivers: validerDto.fraisDivers,
        km: validerDto.km,
        statut: validerDto.statut,
        dateValidation: new Date(),
        commentairesParent: validerDto.commentaireParent,
      },
      include: {
        contrat: {
          include: {
            enfant: true,
            parent: {
              include: {
                utilisateur: true,
              },
            },
            assistant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(mois?: number, annee?: number) {
    const whereClause: Record<string, any> = {};

    // Filtrer par mois et année si fournis
    if (mois && annee) {
      const dateDebut = new Date(annee, mois - 1, 1);
      const dateFin = new Date(annee, mois, 0, 23, 59, 59);
      whereClause.date = {
        gte: dateDebut,
        lte: dateFin,
      };
    }

    return this.prismaService.suiviGardeAssistant.findMany({
      where: whereClause,
      include: {
        contrat: {
          include: {
            enfant: true,
            parent: {
              include: {
                utilisateur: true,
              },
            },
            assistant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const suivi = await this.prismaService.suiviGardeAssistant.findUnique({
      where: { id },
      include: {
        contrat: {
          include: {
            enfant: true,
            parent: {
              include: {
                utilisateur: true,
              },
            },
            assistant: {
              include: {
                utilisateur: true,
              },
            },
          },
        },
      },
    });

    if (!suivi) {
      throw new NotFoundException(`Suivi de garde ${id} introuvable`);
    }

    return suivi;
  }

  /* Récupère l'historique des modifications d'un suivi de garde */
  async getHistorique(suiviGardeId: number) {
    return this.prismaService.historique.findMany({
      where: {
        entityType: 'SUIVI_GARDE',
        entityId: suiviGardeId,
      },
      include: {
        modifiePar: {
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
        createdAt: 'desc',
      },
    });
  }
}
