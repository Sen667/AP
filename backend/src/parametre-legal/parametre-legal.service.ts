import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateParametreLegalDto } from "./dto/create-parametre-legal.dto";
import { UpdateParametreLegalDto } from "./dto/update-parametre-legal.dto";

@Injectable()
export class ParametreLegalService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const today = new Date();
        return await this.prisma.parametreLegal.findMany({
            where: {
                dateMiseEnVigueur: {
                    lte: today,
                },
                OR: [
                    {
                        dateFinVigueur: null,
                    },
                    {
                        dateFinVigueur: {
                            gte: today,
                        },
                    },
                ],
            },
            orderBy: {
                nom: "asc",
            },
        });
    }

    async findById(id: number) {
        const param = await this.prisma.parametreLegal.findUnique({
            where: { id },
        });

        if (!param) {
            throw new NotFoundException(`Paramètre légal #${id} introuvable`);
        }

        return param;
    }

    async findByName(nom: string) {
        const today = new Date();
        const param = await this.prisma.parametreLegal.findFirst({
            where: {
                nom,
                dateMiseEnVigueur: {
                    lte: today,
                },
                OR: [
                    {
                        dateFinVigueur: null,
                    },
                    {
                        dateFinVigueur: {
                            gte: today,
                        },
                    },
                ],
            },
            orderBy: {
                dateMiseEnVigueur: "desc",
            },
        });

        if (!param) {
            throw new NotFoundException(
                `Paramètre légal "${nom}" introuvable`
            );
        }

        return param;
    }

    async create(createDto: CreateParametreLegalDto) {
        return await this.prisma.parametreLegal.create({
            data: {
                nom: createDto.nom,
                valeur: createDto.valeur,
                valeurNet: createDto.valeurNet,
                description: createDto.description,
                dateMiseEnVigueur: createDto.dateMiseEnVigueur,
                dateFinVigueur: createDto.dateFinVigueur,
            },
        });
    }

    async update(id: number, updateDto: UpdateParametreLegalDto) {
        const param = await this.findById(id);

        if (!param) {
            throw new NotFoundException(`Paramètre légal #${id} introuvable`);
        }

        return await this.prisma.parametreLegal.update({
            where: { id },
            data: {
                nom: updateDto.nom ?? param.nom,
                valeur: updateDto.valeur ?? param.valeur,
                valeurNet: updateDto.valeurNet ?? param.valeurNet,
                description: updateDto.description ?? param.description,
                dateMiseEnVigueur:
                    updateDto.dateMiseEnVigueur ?? param.dateMiseEnVigueur,
                dateFinVigueur: updateDto.dateFinVigueur ?? param.dateFinVigueur,
            },
        });
    }

    async delete(id: number) {
        const param = await this.findById(id);

        if (!param) {
            throw new NotFoundException(`Paramètre légal #${id} introuvable`);
        }

        return await this.prisma.parametreLegal.delete({
            where: { id },
        });
    }
}
