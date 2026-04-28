import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.prismaService.utilisateur.findUnique({
            where: { email: loginDto.email },
        });

        if (!user) {
            this.logger.warn(`Échec de l'authentification : utilisateur non trouvé pour l'email ${loginDto.email}`);
            throw new NotFoundException('Identifiants invalides.');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            this.logger.warn(`Échec de l'authentification : mot de passe invalide pour l'email ${loginDto.email}`);
            throw new UnauthorizedException('Identifiants invalides.');
        }

        const payload = { userId: user.id, email: user.email, role: user.role };

        const token = this.jwtService.sign(payload);

        return {
            token,
            utilisateur: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role,
            }
        };
    }

    async register(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;

        const existingUser = await this.prismaService.utilisateur.findUnique({
            where: { email },
        });

        if (existingUser) {
            this.logger.warn(`Échec de l'enregistrement : l'email ${email} est déjà utilisé`);
            throw new ConflictException('Un compte avec cet email existe déjà.');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await this.prismaService.utilisateur.create({
            data: {
                nom: createUserDto.nom,
                prenom: createUserDto.prenom,
                telephone: createUserDto.telephone,
                dateNaissance: new Date(createUserDto.dateNaissance),
                email: createUserDto.email,
                role: createUserDto.role,
                sexe: createUserDto.sexe,
                password: hashedPassword,
            },
        });

        const payload = { userId: newUser.id, email: newUser.email, role: newUser.role };

        const token = this.jwtService.sign(payload);

        return token;
    }
}
