import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PaieController } from './paie.controller';
import { PaieService } from './paie.service';

@Module({
  imports: [PrismaModule],
  providers: [PaieService],
  controllers: [PaieController],
  exports: [PaieService]
})
export class PaieModule { }
