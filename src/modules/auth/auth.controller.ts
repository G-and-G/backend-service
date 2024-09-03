import { Body, Controller, Param, Post, Put, Res } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { InitiateResetPasswordDTO } from './dto/initiate-reset-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
  async initiateEmailVerification(@Body('email') email: string) {
    try {
      await this.authService.initiateEmailVerification(email);
      return { message: 'Email verification initiated successfully' };
    } catch (error) {
      console.log('Error initiating email verification:', error);
      return { message: 'Failed to initiate email verification', error };
    }
  }
  @Put('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    try {
      const userId = await this.authService.verifyEmail(token);

      if (userId) {
        return { message: 'Email verification successful' };
      } else {
        return { message: 'Email verification failed' };
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      return { message: 'An error occurred during email verification' };
    }
  }
}
