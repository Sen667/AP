import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { ContratGardeService } from 'src/contrat-garde/contrat-garde.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssistantProfilDto } from './dto/assistant/create-assistant.dto';
import { UpdateAssistantProfilDto } from './dto/assistant/update-assistant.dto';
import { CreateParentProfilDto } from './dto/parent/create-parent.dto';
import { UpdateParentProfilDto } from './dto/parent/update-parent.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly contratGardeService: ContratGardeService,
  ) {}

  async findAll() {
    return await this.prismaService.utilisateur.findMany({
      include: {
        parentProfil: {
          include: {
            enfants: {
              include: {
                enfant: {
                  include: { personnesAutorisees: true },
                },
              },
            },
          },
        },
        assistantProfil: true,
      },
    });
  }

  async findById(userId: number) {
    const user = await this.prismaService.utilisateur.findUnique({
      where: { id: userId },
      include: {
        parentProfil: {
          include: {
            enfants: {
              include: {
                enfant: {
                  include: { personnesAutorisees: true },
                },
              },
            },
          },
        },
        assistantProfil: true,
      },
    });

    if (!user) {
      this.logger.warn(`Aucun utilisateur trouvé avec l'ID: ${userId}`);
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      sexe: user.sexe,
      dateNaissance: format(user.dateNaissance, 'yyyy-MM-dd'),
      parentProfil: user.parentProfil
        ? {
            id: user.parentProfil.id,
            utilisateurId: user.parentProfil.utilisateurId,
            adresse: user.parentProfil.adresse,
            codePostal: user.parentProfil.codePostal,
            ville: user.parentProfil.ville,
            situationFamiliale: user.parentProfil.situationFamiliale,
            profession: user.parentProfil.profession,
            employeur: user.parentProfil.employeur,
            beneficiaireCAF: user.parentProfil.beneficiaireCAF,
            numeroAllocataire: user.parentProfil.numeroAllocataire,
            contactUrgenceNom: user.parentProfil.contactUrgenceNom,
            contactUrgenceTel: user.parentProfil.contactUrgenceTel,
            enfants: user.parentProfil.enfants.map((lien) => ({
              ...lien.enfant,
              dateNaissance: format(lien.enfant.dateNaissance, 'yyyy-MM-dd'),
              createdAt: lien.enfant.createdAt.toISOString(),
              updatedAt: lien.enfant.updatedAt.toISOString(),
            })),
            createdAt: user.parentProfil.createdAt.toISOString(),
            updatedAt: user.parentProfil.updatedAt.toISOString(),
          }
        : null,
      assistantProfil: user.assistantProfil
        ? {
            ...user.assistantProfil,
            dateObtentionAgrement: format(
              user.assistantProfil.dateObtentionAgrement,
              'yyyy-MM-dd',
            ),
            dateFinAgrement: user.assistantProfil.dateFinAgrement
              ? format(user.assistantProfil.dateFinAgrement, 'yyyy-MM-dd')
              : null,
            createdAt: user.assistantProfil.createdAt.toISOString(),
            updatedAt: user.assistantProfil.updatedAt.toISOString(),
          }
        : null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async createParentProfile(
    userId: number,
    createParentDto: CreateParentProfilDto,
  ) {
    const user = await this.prismaService.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.warn(`Aucun utilisateur trouvé avec l'ID: ${userId}`);
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    await this.prismaService.parentProfil.create({
      data: {
        utilisateurId: userId,
        adresse: createParentDto.adresse,
        codePostal: createParentDto.codePostal,
        ville: createParentDto.ville,
        situationFamiliale: createParentDto.situationFamiliale,
        profession: createParentDto.profession,
        employeur: createParentDto.employeur,
        numeroAllocataire: createParentDto.numeroAllocataire,
        beneficiaireCAF: createParentDto.beneficiaireCAF,
        contactUrgenceNom: createParentDto.contactUrgenceNom,
        contactUrgenceTel: createParentDto.contactUrgenceTel,
      },
    });
  }

  async createAssistantProfile(
    userId: number,
    createAssistantDto: CreateAssistantProfilDto,
  ) {
    const user = await this.prismaService.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.warn(`Aucun utilisateur trouvé avec l'ID: ${userId}`);
      throw new NotFoundException('Utilisateur non trouvé.');
    }

    return await this.prismaService.assistantProfil.create({
      data: {
        utilisateurId: userId,
        adresse: createAssistantDto.adresse,
        codePostal: createAssistantDto.codePostal,
        ville: createAssistantDto.ville,
        numeroAgrement: createAssistantDto.numeroAgrement,
        dateObtentionAgrement: new Date(
          createAssistantDto.dateObtentionAgrement,
        ),
        dateFinAgrement: createAssistantDto.dateFinAgrement
          ? new Date(createAssistantDto.dateFinAgrement)
          : null,
        capaciteAccueil: createAssistantDto.capaciteAccueil,
        experience: createAssistantDto.experience,
        disponibilites: createAssistantDto.disponibilites,
      },
    });
  }

  async updateParentProfile(userId: number, updateDto: UpdateParentProfilDto) {
    await this.findById(userId);

    return this.prismaService.utilisateur.update({
      where: { id: userId },
      data: {
        nom: updateDto.nom,
        prenom: updateDto.prenom,
        telephone: updateDto.telephone,
        dateNaissance: updateDto.dateNaissance
          ? new Date(updateDto.dateNaissance)
          : undefined,
        parentProfil: {
          update: {
            adresse: updateDto.adresse,
            codePostal: updateDto.codePostal,
            ville: updateDto.ville,
            situationFamiliale: updateDto.situationFamiliale,
            profession: updateDto.profession,
            employeur: updateDto.employeur,
            numeroAllocataire: updateDto.numeroAllocataire,
            beneficiaireCAF: updateDto.beneficiaireCAF,
            contactUrgenceNom: updateDto.contactUrgenceNom,
            contactUrgenceTel: updateDto.contactUrgenceTel,
          },
        },
      },
    });
  }

  async updateAssistantProfile(
    userId: number,
    updateDto: UpdateAssistantProfilDto,
  ) {
    await this.findById(userId);

    return this.prismaService.utilisateur.update({
      where: { id: userId },
      data: {
        nom: updateDto.nom,
        prenom: updateDto.prenom,
        telephone: updateDto.telephone,
        dateNaissance: updateDto.dateNaissance
          ? new Date(updateDto.dateNaissance)
          : undefined,
        assistantProfil: {
          update: {
            adresse: updateDto.adresse,
            codePostal: updateDto.codePostal,
            ville: updateDto.ville,
            numeroAgrement: updateDto.numeroAgrement,
            dateObtentionAgrement: updateDto.dateObtentionAgrement
              ? new Date(updateDto.dateObtentionAgrement)
              : undefined,
            dateFinAgrement: updateDto.dateFinAgrement
              ? new Date(updateDto.dateFinAgrement)
              : undefined,
            capaciteAccueil: updateDto.capaciteAccueil,
            experience: updateDto.experience,
            disponibilites: updateDto.disponibilites,
          },
        },
      },
    });
  }

  async findAllAssistants() {
    const assistants = await this.prismaService.utilisateur.findMany({
      where: {
        role: 'ASSISTANT',
      },
      include: {
        assistantProfil: true,
      },
      orderBy: {
        nom: 'asc',
      },
    });

    // Ajouter les heures disponibles pour chaque assistante
    const assistantsAvecHeures = await Promise.all(
      assistants.map(async (assistant) => {
        if (assistant.assistantProfil) {
          try {
            const heuresInfo =
              await this.contratGardeService.getHeuresDisponibles(
                assistant.assistantProfil.id,
              );
            return {
              ...assistant,
              assistantProfil: {
                ...assistant.assistantProfil,
                heuresActuelles: heuresInfo.heuresActuelles,
                heuresMaximum: heuresInfo.heuresMaximum,
                heuresDisponibles: heuresInfo.heuresDisponibles,
              },
            };
          } catch (error) {
            // En cas d'erreur, on retourne l'assistant sans les infos d'heures
            return {
              ...assistant,
              assistantProfil: {
                ...assistant.assistantProfil,
                heuresActuelles: 0,
                heuresMaximum: 45,
                heuresDisponibles: 45,
              },
            };
          }
        }
        return assistant;
      }),
    );

    return assistantsAvecHeures;
  }

  async findAllParents() {
    return this.prismaService.utilisateur.findMany({
      where: { role: 'PARENT' },
      include: {
        parentProfil: {
          include: {
            enfants: true,
          },
        },
      },
      orderBy: {
        nom: 'asc',
      },
    });
  }

  async findParentById(id: number) {
    return this.prismaService.utilisateur.findUnique({
      where: { id },
      include: {
        parentProfil: {
          include: {
            enfants: true,
          },
        },
      },
    });
  }

  async findAssistantById(id: number) {
    return this.prismaService.utilisateur.findUnique({
      where: { id },
      include: {
        assistantProfil: true,
      },
    });
  }
}
