import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CombinedAuthGuard } from './guards/combined-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      }),
    }),
    PrismaModule,
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    Logger,
    JwtAuthGuard,
    RolesGuard,
    CombinedAuthGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule, JwtAuthGuard, RolesGuard, CombinedAuthGuard],
})
export class AuthModule { }
