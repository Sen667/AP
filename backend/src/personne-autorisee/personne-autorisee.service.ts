import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonneAutoriseeDto } from './dto/create-parent-autorisee.dto';
import { UpdatePersonneAutoriseeDto } from './dto/update-parent-autorisee.dto';

@Injectable()
export class PersonneAutoriseeService {
    private readonly logger = new Logger(PersonneAutoriseeService.name);

    constructor(private readonly prismaService: PrismaService) { }

    async findAll() {
        return this.prismaService.personneAutorisee.findMany({
            include: { enfant: true },
        });
    }

    async findById(id: number) {
        const personne = await this.prismaService.personneAutorisee.findUnique({
            where: { id },
            include: { enfant: true },
        });

        if (!personne) {
            this.logger.warn(`Aucune personne autorisée trouvée avec l'ID: ${id}`);
            throw new NotFoundException("Personne autorisée non trouvée.");
        }

        return personne;
    }

    async create(createDto: CreatePersonneAutoriseeDto, enfantId: number, userId: number) {
        const parent = await this.prismaService.parentProfil.findUnique({
            where: { utilisateurId: userId },
        });

        if (!parent) {
            this.logger.warn(`Parent avec l'utilisateur ID ${userId} non trouvé`);
            throw new ForbiddenException("Vous n'avez pas les droits sur cet enfant.");
        }

        const lien = await this.prismaService.lienParentEnfant.findUnique({
            where: { parentId_enfantId: { parentId: parent.id, enfantId } }
        });

        if (!lien) {
            this.logger.warn(`Le parent avec l'ID: ${parent.id} n'a pas de lien avec l'enfant ID: ${enfantId}`);
            throw new ForbiddenException("Vous n'avez pas les droits sur cet enfant.");
        }

        return await this.prismaService.personneAutorisee.create({
            data: {
                enfantId,
                nom: createDto.nom,
                prenom: createDto.prenom,
                telephone: createDto.telephone,
                email: createDto.email,
                lien: createDto.lien,
            },
        });
    }

    async update(id: number, updateDto: UpdatePersonneAutoriseeDto, userId: number) {
        const parent = await this.prismaService.parentProfil.findUnique({
            where: { utilisateurId: userId },
        });

        if (!parent) {
            this.logger.warn(`Parent avec l'utilisateur ID ${userId} non trouvé`);
            throw new ForbiddenException("Vous n'avez pas les droits sur cet enfant.");
        }

        const personne = await this.findById(id);
        await this.checkParentOwnership(personne.enfantId, parent.id);

        return await this.prismaService.personneAutorisee.update({
            where: { id },
            data: {
                enfantId: updateDto.enfantId,
                nom: updateDto.nom,
                prenom: updateDto.prenom,
                telephone: updateDto.telephone,
                email: updateDto.email,
                lien: updateDto.lien,
            },
        });
    }

    async delete(id: number, userId: number) {
        const parent = await this.prismaService.parentProfil.findUnique({
            where: { utilisateurId: userId },
        });

        if (!parent) {
            this.logger.warn(`Parent avec l'utilisateur ID ${userId} non trouvé`);
            throw new ForbiddenException("Vous n'avez pas les droits sur cet enfant.");
        }

        const personne = await this.findById(id);
        await this.checkParentOwnership(personne.enfantId, parent.id);

        await this.prismaService.personneAutorisee.delete({ where: { id } });
    }

    private async checkParentOwnership(enfantId: number, parentId: number) {
        const lien = await this.prismaService.lienParentEnfant.findUnique({
            where: { parentId_enfantId: { parentId, enfantId } },
        });

        if (!lien) {
            this.logger.warn(`Le parent avec l'ID: ${parentId} n'a pas de lien avec l'enfant ID: ${enfantId}`);
            throw new ForbiddenException("Vous n'avez pas les droits sur cet enfant.");
        }
    }
}
