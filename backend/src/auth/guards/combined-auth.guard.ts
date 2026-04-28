import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role.guard';

/**
 * Guard composite qui combine JWT + Roles
 * @UseGuards(CombinedAuthGuard) au lieu de @UseGuards(JwtAuthGuard, RolesGuard)
 */
@Injectable()
export class CombinedAuthGuard implements CanActivate {
    constructor(
        private jwtAuthGuard: JwtAuthGuard,
        private rolesGuard: RolesGuard,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Vérifie d'abord le JWT
        const isJwtValid = await this.jwtAuthGuard.canActivate(context);
        if (!isJwtValid) return false;

        // Puis vérifie les rôles
        return this.rolesGuard.canActivate(context);
    }
}
