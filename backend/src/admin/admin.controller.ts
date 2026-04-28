import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/types/enums';
import { CombinedAuthGuard } from 'src/auth/guards/combined-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@UseGuards(CombinedAuthGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('statistics')
    @ApiOperation({ summary: 'Récupérer les statistiques du RAM' })
    async getStatistics() {
        const stats = await this.adminService.getStatistics();
        return {
            message: 'Statistiques récupérées',
            data: stats,
        };
    }
}
