import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: "Vérifier l'état de santé de l'API" })
  @ApiOkResponse({
    description: 'Retourne un statut simple pour les health checks.',
    schema: {
      example: { status: 'ok' },
    },
  })
  health(): { status: string } {
    return { status: 'ok' };
  }

  @Get()
  @ApiOperation({
    summary:
      "Retourner un message de bienvenue et un lien vers la documentation de l'API",
  })
  @ApiOkResponse({
    description:
      "Retourne un message de bienvenue et un lien vers la documentation de l'API.",
    schema: {
      example: { message: "Bienvenue sur l'API !", documentation: '/api/docs' },
    },
  })
  getHello(): { message: string; documentation: string } {
    return this.appService.getHello();
  }
}
