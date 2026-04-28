import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnfantDto } from './dto/create-enfant.dto';
import { UpdateEnfantDto } from './dto/update-enfant.dto';

@Injectable()
export class EnfantService {
    private readonly logger = new Logger(EnfantService.name);

    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async create(createEnfantDto: CreateEnfantDto, parentId: number) {
        const parent = await this.prismaService.parentProfil.findUnique({
            where: { utilisateurId: parentId },
        });

        if (!parent) {
            this.logger.warn(`Parent avec l'utilisateur ID ${parentId} non trouvé`);
            throw new NotFoundException(`Parent avec l'utilisateur ID ${parentId} non trouvé.`);
        }

        return await this.prismaService.enfant.create({
            data: {
                nom: createEnfantDto.nom,
                prenom: createEnfantDto.prenom,
                dateNaissance: new Date(createEnfantDto.dateNaissance),
                sexe: createEnfantDto.sexe,
                allergies: createEnfantDto.allergies ?? null,
                remarquesMedicales: createEnfantDto.remarquesMedicales ?? null,
                medecinTraitant: createEnfantDto.medecinTraitant,
                medecinTraitantTel: createEnfantDto.medecinTraitantTel,
                parents: {
                    create: { parentId: parent.id },
                },
            },
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
                personnesAutorisees: true,
            },
        });
    }

    async update(id: number, updateEnfantDto: UpdateEnfantDto, utilisateurId: number) {
        const parent = await this.prismaService.parentProfil.findUnique({
            where: { utilisateurId },
        });

        if (!parent) {
            this.logger.warn(`Parent avec l'utilisateur ID ${utilisateurId} non trouvé`);
            throw new ForbiddenException("Parent non trouvé");
        }

        await this.checkParentOwnership(id, parent.id);

        return await this.prismaService.enfant.update({
            where: { id },
            data: {
                nom: updateEnfantDto.nom,
                prenom: updateEnfantDto.prenom,
                dateNaissance: updateEnfantDto.dateNaissance ? new Date(updateEnfantDto.dateNaissance) : undefined,
                sexe: updateEnfantDto.sexe,
                allergies:
                    updateEnfantDto.hasOwnProperty("allergies") ? updateEnfantDto.allergies : undefined,
                remarquesMedicales:
                    updateEnfantDto.hasOwnProperty("remarquesMedicales")
                        ? updateEnfantDto.remarquesMedicales
                        : undefined,
                medecinTraitant: updateEnfantDto.medecinTraitant,
                medecinTraitantTel: updateEnfantDto.medecinTraitantTel,
            },
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
                personnesAutorisees: true,
            },
        });
    }

    async delete(id: number, utilisateurId: number) {
        // Vérifier le rôle de l'utilisateur
        const utilisateur = await this.prismaService.utilisateur.findUnique({
            where: { id: utilisateurId },
            select: { role: true }
        });

        if (!utilisateur) {
            this.logger.warn(`Utilisateur ID ${utilisateurId} non trouvé`);
            throw new ForbiddenException("Utilisateur non trouvé");
        }

        // Si ce n'est pas un admin, vérifier que c'est son enfant (logique parent)
        if (utilisateur.role !== 'ADMIN') {
            const parent = await this.prismaService.parentProfil.findUnique({
                where: { utilisateurId },
            });

            if (!parent) {
                this.logger.warn(`Parent avec l'utilisateur ID ${utilisateurId} non trouvé`);
                throw new ForbiddenException("Parent non trouvé");
            }

            await this.checkParentOwnership(id, parent.id);
        }

        // Vérifier si l'enfant a des contrats de garde actifs (non terminés)
        const contratsActifsCount = await this.prismaService.contratGarde.count({
            where: {
                enfantId: id,
                statut: {
                    not: 'TERMINE'
                }
            },
        });

        if (contratsActifsCount > 0) {
            this.logger.warn(`Impossible de supprimer l'enfant ID ${id} : ${contratsActifsCount} contrat(s) actif(s)`);
            throw new BadRequestException(
                "Impossible de supprimer cet enfant car il est lié à un ou plusieurs contrats de garde actifs. Veuillez d'abord révoquer ou terminer les contrats."
            );
        }

        await this.prismaService.enfant.delete({
            where: { id },
        });
    }

    private async checkParentOwnership(enfantId: number, parentId: number) {
        const lien = await this.prismaService.lienParentEnfant.findUnique({
            where: {
                parentId_enfantId: {
                    parentId,
                    enfantId,
                },
            },
        });

        if (!lien) {
            this.logger.warn(`Le parent ID ${parentId} n'a pas de lien avec l'enfant ID ${enfantId}`);
            throw new ForbiddenException("Vous n'avez pas les droits sur cet enfant.");
        }
    }

    async findAllChildren() {
        return this.prismaService.enfant.findMany({
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
            orderBy: {
                nom: 'asc',
            },
        });
    }

    async findChildById(id: number) {
        return this.prismaService.enfant.findUnique({
            where: { id },
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
    }

    async findByParent(utilisateurId: number) {
        const parent = await this.prismaService.parentProfil.findUnique({
            where: { utilisateurId },
        });

        if (!parent) {
            this.logger.warn(`Parent avec l'utilisateur ID ${utilisateurId} non trouvé`);
            throw new NotFoundException(`Parent avec l'utilisateur ID ${utilisateurId} non trouvé.`);
        }

        const liens = await this.prismaService.lienParentEnfant.findMany({
            where: { parentId: parent.id },
            include: {
                enfant: true,
            },
        });

        return liens.map(lien => lien.enfant);
    }
}
