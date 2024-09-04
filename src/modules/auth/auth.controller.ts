import { Body, Controller, Param, Post, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { InitiateResetPasswordDTO } from './dto/initiate-reset-password.dto';
import { LoginDTO } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import {
  InitiateEmailVerificationDTO,
  VerifyEmailDTO,
} from './dto/verify-email-dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @Post('AdminLogin')
  async adminLogin(@Body() dto: LoginDTO, @Res() res: Response) {
    console.log(dto);
    const result = await this.authService.adminAuth(dto);
    return res.status(result.status).json(result.response);
  }

  @Post('initiate-reset-password')
  async initiateResetPassword(@Body() dto: InitiateResetPasswordDTO) {
    return await this.authService.initiateResetPassword(dto.email);
  }
  @Put('reset-password/:token')
  async resetPassword(
    @Body() dto: ResetPasswordDTO,
    @Param('token') token: string,
  ) {
    return this.authService.resetPassword(token, dto.newPassword);
  }

  @Post('initiate-email-verification')
  async initiateEmailVerification(
    @Body('email') dto: InitiateEmailVerificationDTO,
  ) {
    return this.authService.initiateEmailVerification(dto.email);
  }
  @Post('verify-email/:token')
  async verifyEmail(
    @Param('token') token: string,
    @Body() dto: VerifyEmailDTO,
  ) {
    return this.authService.verifyEmail(token, dto.email);
  }
}
