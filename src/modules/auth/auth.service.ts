import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, VerificationStatus } from '@prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/modules/user/user.service';
import ApiResponse from 'src/utils/ApiResponse';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async login(dto: LoginDTO) {
    try {
      const user = await this.userService.getUserByEmail(dto.email);

      const match = compareSync(dto.password, user.password);

      if (!match || !user) {
        return {
          status: 400,
          response: { message: 'Invalid email or password' },
        };
      }
      const verification = await this.prisma.verification.findFirst({
        where: {
          user_id: user.id,
        },
      });
      if (verification.verification_status !== VerificationStatus.VERIFIED) {
        throw new Error('Email is not verified!');
      }
      const token = this.jwtService.sign(
        { id: user.id, role: user.role },
        { expiresIn: '1d' },
      );
      return ApiResponse.success('Logged in successfully', { token, user });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
  async adminAuth(dto: LoginDTO) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (user.role !== Role.HOTEL_ADMIN) {
      console.log('not admin');

      return {
        status: 400,
        response: { message: 'Unauthorised not an admin' },
      };
    } else {
      if (!user) {
        return {
          status: 400,
          response: { message: 'Invalid email or password' },
        };
      }

      const match = compareSync(dto.password, user.password);

      if (!match) {
        return {
          status: 400,
          response: { message: 'Invalid email or password' },
        };
      }

      const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1d' });

      return {
        status: 200,
        response: { message: 'Admin logged in  successful', token, user },
      };
    }
  }
  async initiateResetPassword(email: string): Promise<ApiResponse> {
    try {
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw new Error('Email not found!');
      }

      const resetToken = randomBytes(32).toString('hex');

      await this.userService.updateResetToken(user.id, resetToken);

      await this.mailService.sendResetPasswordEmail({
        email: user.email,
        token: resetToken,
        names: `${user.first_name} ${user.last_name}`,
      });

      return ApiResponse.success('Initiated reset password successfully!');
    } catch (error) {
      console.log(error);
      ApiResponse.error(
        'Error occurred initiating password reset',
        error.message,
        error.status,
      );
    }
  }
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    try {
      const user = await this.userService.getUserByResetToken(token);

      if (!user) {
        return;
      }

      const hashedPassword = hashSync(newPassword, 10);

      await this.userService.updatePasswordAndClearToken(
        user.id,
        hashedPassword,
      );
      return ApiResponse.success('Email reset successfully!', user);
    } catch (err) {
      console.log(err);
    }
  }

  async initiateEmailVerification(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      await this.mailService.sendInitiateEmailVerificationEmail({
        email: user.email,
        verificationCode,
        names: `${user.first_name} ${user.last_name}`,
      });

      return { message: 'Email verification initiated' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to initiate email verification');
    }
  }

  async verifyEmail(token: string, email: string): Promise<ApiResponse> {
    return this.userService.verifyEmail(token, email);
  }
}
