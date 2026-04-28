import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PersonneAutoriseeController } from './personne-autorisee.controller';
import { PersonneAutoriseeService } from './personne-autorisee.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [PersonneAutoriseeController],
  providers: [PersonneAutoriseeService]
})
export class PersonneAutoriseeModule { }
