import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private readonly prismaService: PrismaService) { }

    async getStatistics() {
        const [totalUsers, totalParents, totalAssistants, totalChildren, totalContracts] = await Promise.all([
            this.prismaService.utilisateur.count(),
            this.prismaService.utilisateur.count({ where: { role: 'PARENT' } }),
            this.prismaService.utilisateur.count({ where: { role: 'ASSISTANT' } }),
            this.prismaService.enfant.count(),
            this.prismaService.contratGarde.count(),
        ]);

        return {
            totalUsers,
            totalParents,
            totalAssistants,
            totalChildren,
            totalContracts,
        };
    }
}
