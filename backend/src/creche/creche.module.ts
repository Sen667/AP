import { Module } from '@nestjs/common';
import { CrecheService } from './creche.service';
import { CrecheController } from './creche.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CrecheService],
  controllers: [CrecheController]
})
export class CrecheModule { }
