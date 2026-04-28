import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags("Authentification")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Authentification utilisateur' })
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({ description: 'Utilisateur authentifié avec succès.' })
    async login(@Body() loginDto: LoginDto) {
        const result = await this.authService.login(loginDto);

        return result;
    }

    @Post('register')
    @ApiOperation({ summary: 'Enregistrement d\'un nouvel utilisateur' })
    @ApiBody({ type: CreateUserDto })
    @ApiOkResponse({ description: 'Utilisateur enregistré avec succès.' })
    async register(@Body() createUserDto: CreateUserDto) {
        const token = await this.authService.register(createUserDto);

        return {
            message: 'Utilisateur enregistré avec succès.',
            token,
        }
    }
}
