import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParametreLegalController } from './parametre-legal.controller';
import { ParametreLegalService } from './parametre-legal.service';

@Module({
  controllers: [ParametreLegalController],
  providers: [ParametreLegalService, PrismaService],
  exports: [ParametreLegalService],
})
export class ParametreLegalModule {}
