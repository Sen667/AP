import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ContratGardeModule } from 'src/contrat-garde/contrat-garde.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, AuthModule, ContratGardeModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, AuthModule],
})
export class UserModule {}
