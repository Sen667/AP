import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SuiviGardeController } from './suivi-garde.controller';
import { SuiviGardeService } from './suivi-garde.service';

@Module({
  imports: [PrismaModule],
  controllers: [SuiviGardeController],
  providers: [SuiviGardeService],
  exports: [SuiviGardeService]
})
export class SuiviGardeModule { }
