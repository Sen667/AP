import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAtelierDto } from './dto/create-atelier.dto';
import { CreateInscriptionAtelierDto } from './dto/create-inscription-atelier.dto';
import { UpdateAtelierDto } from './dto/update-atelier.dto';

@Injectable()
export class AteliersService {
  constructor(private readonly prisma: PrismaService) {}

  private async getParentProfilId(userId: number): Promise<number> {
    const profil = await this.prisma.parentProfil.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });
    if (!profil) throw new NotFoundException('Profil parent introuvable');
    return profil.id;
  }

  private async getAssistantProfilId(userId: number): Promise<number> {
    const profil = await this.prisma.assistantProfil.findUnique({
      where: { utilisateurId: userId },
      select: { id: true },
    });
    if (!profil) throw new NotFoundException('Profil assistant introuvable');
    return profil.id;
  }

  private atelierInclude() {
    return {
      animateur: {
        include: {
          utilisateur: {
            select: { id: true, prenom: true, nom: true },
          },
        },
      },
      inscriptions: {
        include: {
          enfant: { select: { id: true, prenom: true, nom: true } },
          parent: {
            include: {
              utilisateur: { select: { id: true, prenom: true, nom: true } },
            },
          },
          assistant: {
            include: {
              utilisateur: { select: { id: true, prenom: true, nom: true } },
            },
          },
        },
      },
    };
  }

  async create(dto: CreateAtelierDto) {
    return this.prisma.atelier.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        dateLimiteInscription: new Date(dto.dateLimiteInscription),
      },
      include: this.atelierInclude(),
    });
  }

  async update(id: number, dto: UpdateAtelierDto) {
    await this.ensureExists(id);
    return this.prisma.atelier.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
        dateLimiteInscription: dto.dateLimiteInscription
          ? new Date(dto.dateLimiteInscription)
          : undefined,
      },
      include: this.atelierInclude(),
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.atelier.delete({ where: { id } });
  }

  async findAll(typePublic?: string) {
    return this.prisma.atelier.findMany({
      where: typePublic ? { typePublic: typePublic as any } : undefined,
      orderBy: { date: 'asc' },
      include: this.atelierInclude(),
    });
  }

  async findOne(id: number) {
    await this.ensureExists(id);
    return this.prisma.atelier.findUnique({
      where: { id },
      include: this.atelierInclude(),
    });
  }

  /** Ateliers à venir (date >= aujourd'hui) */
  async findUpcoming() {
    return this.prisma.atelier.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      include: this.atelierInclude(),
    });
  }

  /** Inscription d'un parent (+ enfant si besoin) à un atelier */
  async inscrire(dto: CreateInscriptionAtelierDto, userId: number) {
    const parentId = await this.getParentProfilId(userId);
    const atelier = await this.prisma.atelier.findUnique({
      where: { id: dto.atelierId },
      include: { inscriptions: true },
    });

    if (!atelier) throw new NotFoundException('Atelier introuvable');

    // Vérifier la date limite
    if (new Date() > new Date(atelier.dateLimiteInscription)) {
      throw new BadRequestException(
        "La date limite d'inscription est dépassée",
      );
    }

    // Vérifier les places disponibles
    if (atelier.inscriptions.length >= atelier.nombrePlaces) {
      throw new BadRequestException("L'atelier est complet");
    }

    // Pour les ateliers avec enfants, l'enfantId est requis
    const needsEnfant = ['ENFANT', 'MIXTE'].includes(atelier.typePublic);
    if (needsEnfant && !dto.enfantId) {
      throw new BadRequestException(
        "Un enfant doit être sélectionné pour ce type d'atelier",
      );
    }

    // Vérifier que l'enfant appartient au parent si fourni
    if (dto.enfantId) {
      const lien = await this.prisma.lienParentEnfant.findUnique({
        where: { parentId_enfantId: { parentId, enfantId: dto.enfantId } },
      });
      if (!lien)
        throw new ForbiddenException('Cet enfant ne vous appartient pas');

      // Vérifier doublon
      const existing = await this.prisma.inscriptionAtelier.findUnique({
        where: {
          atelierId_enfantId: {
            atelierId: dto.atelierId,
            enfantId: dto.enfantId,
          },
        },
      });
      if (existing)
        throw new BadRequestException(
          'Cet enfant est déjà inscrit à cet atelier',
        );
    } else {
      // Inscription parent seul : vérifier doublon
      const existing = await this.prisma.inscriptionAtelier.findFirst({
        where: { atelierId: dto.atelierId, parentId },
      });
      if (existing)
        throw new BadRequestException('Vous êtes déjà inscrit à cet atelier');
    }

    let resolvedEnfantId: number;
    if (dto.enfantId) {
      resolvedEnfantId = dto.enfantId;
    } else {
      const lien = await this.prisma.lienParentEnfant.findFirst({
        where: { parentId },
        select: { enfantId: true },
      });
      if (!lien)
        throw new BadRequestException('Aucun enfant trouvé pour ce parent');
      resolvedEnfantId = lien.enfantId;
    }

    return this.prisma.inscriptionAtelier.create({
      data: {
        atelierId: dto.atelierId,
        parentId,
        enfantId: resolvedEnfantId,
      },
      include: {
        atelier: true,
        enfant: { select: { id: true, prenom: true, nom: true } },
      },
    });
  }

  /** Inscription d'un assistant à un atelier */
  async inscrireAssistant(dto: CreateInscriptionAtelierDto, userId: number) {
    const assistantId = await this.getAssistantProfilId(userId);
    const atelier = await this.prisma.atelier.findUnique({
      where: { id: dto.atelierId },
      include: { inscriptions: true },
    });

    if (!atelier) throw new NotFoundException('Atelier introuvable');

    if (new Date() > new Date(atelier.dateLimiteInscription)) {
      throw new BadRequestException(
        "La date limite d'inscription est dépassée",
      );
    }

    if (atelier.inscriptions.length >= atelier.nombrePlaces) {
      throw new BadRequestException("L'atelier est complet");
    }

    // Vérifier doublon
    const existing = await this.prisma.inscriptionAtelier.findUnique({
      where: {
        atelierId_assistantId: { atelierId: dto.atelierId, assistantId },
      },
    });
    if (existing)
      throw new BadRequestException('Vous êtes déjà inscrit à cet atelier');

    return this.prisma.inscriptionAtelier.create({
      data: { atelierId: dto.atelierId, assistantId },
      include: { atelier: true },
    });
  }

  /** Désinscription d'un parent */
  async desinscrire(atelierId: number, userId: number) {
    const parentId = await this.getParentProfilId(userId);

    const inscription = await this.prisma.inscriptionAtelier.findFirst({
      where: { atelierId, parentId },
    });

    if (!inscription) throw new NotFoundException('Inscription non trouvée');

    const atelier = await this.prisma.atelier.findUnique({
      where: { id: atelierId },
    });
    if (atelier && new Date() > new Date(atelier.dateLimiteInscription)) {
      throw new BadRequestException(
        'La date limite est dépassée, désinscription impossible',
      );
    }

    return this.prisma.inscriptionAtelier.delete({
      where: { id: inscription.id },
    });
  }

  /** Désinscription d'un assistant */
  async desinscrireAssistant(atelierId: number, userId: number) {
    const assistantId = await this.getAssistantProfilId(userId);

    const inscription = await this.prisma.inscriptionAtelier.findUnique({
      where: { atelierId_assistantId: { atelierId, assistantId } },
    });

    if (!inscription) throw new NotFoundException('Inscription non trouvée');

    const atelier = await this.prisma.atelier.findUnique({
      where: { id: atelierId },
    });
    if (atelier && new Date() > new Date(atelier.dateLimiteInscription)) {
      throw new BadRequestException(
        'La date limite est dépassée, désinscription impossible',
      );
    }

    return this.prisma.inscriptionAtelier.delete({
      where: { id: inscription.id },
    });
  }

  /** Mes inscriptions (parent) */
  async mesInscriptions(userId: number) {
    const parentId = await this.getParentProfilId(userId);
    return this.prisma.inscriptionAtelier.findMany({
      where: { parentId },
      include: {
        atelier: true,
        enfant: { select: { id: true, prenom: true, nom: true } },
      },
      orderBy: { atelier: { date: 'asc' } },
    });
  }

  /** Mes inscriptions (assistant) */
  async mesInscriptionsAssistant(userId: number) {
    const assistantId = await this.getAssistantProfilId(userId);
    return this.prisma.inscriptionAtelier.findMany({
      where: { assistantId },
      include: { atelier: true },
      orderBy: { atelier: { date: 'asc' } },
    });
  }

  /** Marquer présence (Admin) */
  async marquerPresence(inscriptionId: number, present: boolean) {
    const inscription = await this.prisma.inscriptionAtelier.findUnique({
      where: { id: inscriptionId },
    });
    if (!inscription) throw new NotFoundException('Inscription non trouvée');

    return this.prisma.inscriptionAtelier.update({
      where: { id: inscriptionId },
      data: { present },
    });
  }

  private async ensureExists(id: number) {
    const atelier = await this.prisma.atelier.findUnique({ where: { id } });
    if (!atelier) throw new NotFoundException(`Atelier ${id} introuvable`);
    return atelier;
  }
}
