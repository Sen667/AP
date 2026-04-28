import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AteliersController } from './ateliers.controller';
import { AteliersService } from './ateliers.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AteliersController],
  providers: [AteliersService],
  exports: [AteliersService],
})
export class AteliersModule { }
