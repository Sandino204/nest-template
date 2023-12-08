import {Body, Controller, Post} from '@nestjs/common';
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {AuthService} from "./auth.service";
import {SignUpDto} from "./dto/sign-up.dto";
import {LoginDto} from "./dto/login.dto";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    async signUp(@Body() payload: SignUpDto) {
        return await this.authService.signUp(payload)
    }

    @Post('/login')
    async login(@Body() payload: LoginDto) {
        return await this.authService.login(payload)
    }
}
