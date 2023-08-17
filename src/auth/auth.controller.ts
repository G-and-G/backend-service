import { Body, Controller, Param, Post, Put, Res } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { InitiateResetPasswordDTO } from './dto/initiate-reset-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
@ApiTags("auth")
export class AuthController {

    constructor(private authService: AuthService) { }

   
    @Post("login")
    async login(@Body() dto: LoginDTO, @Res() res: Response) {
        const result = await this.authService.login(dto);
        return res.status(result.status).json(result.response);
    }

    @Post("initiate-reset-password")
    async initiateResetPassword(@Body() dto: InitiateResetPasswordDTO) {

    }

    @Put("reset-password/:token")
    async resetPassword(@Body() dto: ResetPasswordDTO, @Param("token") token: string) {

    }

    @Post("initiate-email-verification")
    async initiateEmailVerification() {

    }

    @Put("verify-email/:token")
    async verifyEmail(@Param("token") token: string) {

    }
}
