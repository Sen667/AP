import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EnfantController } from './enfant.controller';
import { EnfantService } from './enfant.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule
  ],
  controllers: [EnfantController],
  providers: [EnfantService],
  exports: [EnfantService, AuthModule]
})
export class EnfantModule { }
