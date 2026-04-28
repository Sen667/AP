import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContratGardeModule } from './contrat-garde/contrat-garde.module';
import { EnfantModule } from './enfant/enfant.module';
import { PaieModule } from './paie/paie.module';
import { ParametreLegalModule } from './parametre-legal/parametre-legal.module';
import { PersonneAutoriseeModule } from './personne-autorisee/personne-autorisee.module';
import { PrismaModule } from './prisma/prisma.module';
import { SuiviGardeModule } from './suivi-garde/suivi-garde.module';
import { SuiviJournalierModule } from './suivi-journalier/suivi-journalier.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { PdfModule } from './pdf/pdf.module';
import { AteliersModule } from './ateliers/ateliers.module';
import { CrecheModule } from './creche/creche.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    UserModule,
    EnfantModule,
    PersonneAutoriseeModule,
    AdminModule,
    ContratGardeModule,
    ParametreLegalModule,
    SuiviGardeModule,
    SuiviJournalierModule,
    PaieModule,
    PdfModule,
    AteliersModule,
    CrecheModule,
  ],
  controllers: [
    AppController,
    UserController
  ],
  providers: [
    AppService,
    Logger,
    UserService
  ],
})
export class AppModule { }