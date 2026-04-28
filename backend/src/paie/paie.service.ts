import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenererPaieDto } from './dto/generer-paie.dto';

@Injectable()
export class PaieService {
    constructor(private readonly prismaService: PrismaService) { }

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
            orderBy: { dateMiseEnVigueur: 'desc' }
        });

        return parametre ? Number(parametre.valeur) : null;
    }

    private calculerHeures(arriveeMinutes: number, departMinutes: number): number {
        const diffMinutes = departMinutes - arriveeMinutes;
        return Math.round((diffMinutes / 60) * 100) / 100;
    }

    async genererPaie(genererPaieDto: GenererPaieDto) {
        const contrat = await this.prismaService.contratGarde.findFirst({
            where: { id: genererPaieDto.contratId },
            include: {
                enfant: true,
                assistant: { include: { utilisateur: true } },
                parent: { include: { utilisateur: true } }
            }
        });

        if (!contrat) {
            throw new NotFoundException(`Contrat de garde ${genererPaieDto.contratId} introuvable`);
        }

        const paieExistante = await this.prismaService.paie.findUnique({
            where: {
                contratId_mois_annee: {
                    contratId: genererPaieDto.contratId,
                    mois: genererPaieDto.mois,
                    annee: genererPaieDto.annee
                }
            }
        });

        if (paieExistante) {
            throw new BadRequestException(
                `Une fiche de paie existe déjà pour ${genererPaieDto.mois}/${genererPaieDto.annee}`
            );
        }

        const smicHoraire = await this.getParametreLegal('SMIC_HORAIRE_BRUT');
        const tauxChargePatronale = await this.getParametreLegal('TAUX_CHARGE_PATRONALE');
        const tauxChargeSalariale = await this.getParametreLegal('TAUX_CHARGE_SALARIALE');
        const majorationHeureSup = await this.getParametreLegal('MAJORATION_HEURE_SUP');

        if (!smicHoraire || !tauxChargePatronale || !tauxChargeSalariale || !majorationHeureSup) {
            throw new BadRequestException(
                'Les paramètres légaux ne sont pas tous configurés dans la base de données'
            );
        }

        const dateDebut = new Date(genererPaieDto.annee, genererPaieDto.mois - 1, 1);
        const dateFin = new Date(genererPaieDto.annee, genererPaieDto.mois, 0, 23, 59, 59);

        const suivis = await this.prismaService.suiviGardeAssistant.findMany({
            where: {
                contratId: genererPaieDto.contratId,
                date: { gte: dateDebut, lte: dateFin },
                statut: 'VALIDE'
            }
        });

        if (suivis.length === 0) {
            throw new BadRequestException(
                `Aucun suivi validé trouvé pour ${genererPaieDto.mois}/${genererPaieDto.annee}`
            );
        }

        let nombreHeuresNormales = 0;
        let nombreHeuresMajorees = 0;

        const heuresJournalieres = Number(contrat.nombreHeuresSemaine) / 5;

        for (const suivi of suivis) {
            if (suivi.arriveeMinutes !== null && suivi.departMinutes !== null) {
                const heuresTravaillees = this.calculerHeures(suivi.arriveeMinutes, suivi.departMinutes);

                if (heuresTravaillees <= heuresJournalieres) {
                    nombreHeuresNormales += heuresTravaillees;
                } else {
                    nombreHeuresNormales += heuresJournalieres;
                    nombreHeuresMajorees += heuresTravaillees - heuresJournalieres;
                }
            }
        }

        const tarifHoraire = Math.max(Number(contrat.tarifHoraireBrut), smicHoraire);
        const tarifHoraireMajore = tarifHoraire * (1 + majorationHeureSup);

        const salaireBrut =
            nombreHeuresNormales * tarifHoraire +
            nombreHeuresMajorees * tarifHoraireMajore;

        const chargesPatronales = salaireBrut * tauxChargePatronale;
        const chargesSalariales = salaireBrut * tauxChargeSalariale;
        const salaireNet = salaireBrut - chargesSalariales;

        return this.prismaService.paie.create({
            data: {
                contratId: genererPaieDto.contratId,
                mois: genererPaieDto.mois,
                annee: genererPaieDto.annee,
                heuresNormales: nombreHeuresNormales,
                heuresMajorees: nombreHeuresMajorees,
                salaireBrut,
                salaireNet,
                chargesPatronales,
                chargesSalariales,
                commentaire: genererPaieDto.commentaire
            },
            include: {
                contrat: {
                    include: {
                        enfant: true,
                        assistant: { include: { utilisateur: true } },
                        parent: { include: { utilisateur: true } }
                    }
                }
            }
        });
    }

    async findAll(annee?: number, mois?: number) {
        return this.prismaService.paie.findMany({
            where: {
                ...(annee && { annee }),
                ...(mois && { mois })
            },
            include: {
                contrat: {
                    include: {
                        enfant: true,
                        assistant: { include: { utilisateur: true } },
                        parent: { include: { utilisateur: true } }
                    }
                }
            },
            orderBy: [{ annee: 'desc' }, { mois: 'desc' }]
        });
    }

    async findOne(id: number) {
        const paie = await this.prismaService.paie.findUnique({
            where: { id },
            include: {
                contrat: {
                    include: {
                        enfant: true,
                        assistant: { include: { utilisateur: true } },
                        parent: { include: { utilisateur: true } }
                    }
                }
            }
        });

        if (!paie) {
            throw new NotFoundException(`Fiche de paie ${id} introuvable`);
        }

        return paie;
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prismaService.paie.delete({ where: { id } });
    }
}