import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ContratGardeController } from './contrat-garde.controller';
import { ContratGardeService } from './contrat-garde.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ContratGardeController],
  providers: [ContratGardeService],
  exports: [ContratGardeService],
})
export class ContratGardeModule { }
