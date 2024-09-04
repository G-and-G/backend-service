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
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    try {
      const match = compareSync(dto.password, user.password);

      if (!match || !user) {
        throw new BadRequestException('Invalid email or password');
      }
      const verification = await this.prisma.verification.findFirst({
        where: {
          user_id: user.id,
        },
      });
      if (verification.verification_status !== VerificationStatus.VERIFIED) {
        // Please notify frontend before changing this message
        throw new BadRequestException('Email is not verified!');
      }
      const token = this.jwtService.sign(
        { id: user.id, role: user.role },
        { expiresIn: '1d' },
      );
      return ApiResponse.success('Logged in successfully', { token, user });
    } catch (error) {
      console.log(error);
      throw error;
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
  // platform can be 'web' or 'mobile'
  async initiateResetPassword(
    email: string,
    platform: string,
  ): Promise<ApiResponse> {
    try {
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw new Error('Email not found!');
      }

      let userResetToken = await this.prisma.passwordReset.findUnique({
        where: { user_id: user.id },
      });
      const resetToken = randomBytes(32).toString('hex');
      if (!userResetToken) {
        userResetToken = await this.prisma.passwordReset.create({
          data: {
            user_id: user.id,
            passwordResetToken: resetToken,
            passwordResetExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
          },
        });
      } else {
        userResetToken = await this.prisma.passwordReset.update({
          where: { user_id: user.id },
          data: {
            passwordResetToken: resetToken,
            passwordResetExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
          },
        });
      }

      await this.mailService.sendResetPasswordEmail({
        email: user.email,
        token: resetToken,
        names: `${user.first_name} ${user.last_name}`,
        platform,
      });

      return ApiResponse.success('Initiated reset password successfully!');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    try {
      const user = await this.userService.getUserByResetToken(token);

      if (!user) {
        throw new BadRequestException('Invalid token');
      }

      const isResetTokenValid =
        new Date(user.password_reset.passwordResetExpiry).getTime() >
        new Date().getTime();
      if (!isResetTokenValid) {
        throw new BadRequestException('Reset token has expired');
      }

      const hashedPassword = hashSync(newPassword, 10);

      await this.userService.updatePasswordAndClearToken(
        user.id,
        hashedPassword,
      );
      return ApiResponse.success('Email reset successfully!', user);
    } catch (err) {
      console.log(err);
      throw err;
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
      await this.prisma.verification.update({
        where: {
          user_id: user.id,
        },
        data: {
          verificationToken: verificationCode,
          verificationTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });
      await this.mailService.sendInitiateEmailVerificationEmail({
        email: user.email,
        verificationCode,
        names: `${user.first_name} ${user.last_name}`,
      });

      // return { message: 'Email verification initiated' };
      return ApiResponse.success('Email verification initiated');
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to initiate email verification');
    }
  }

  async verifyEmail(token: string, email: string): Promise<ApiResponse> {
    return this.userService.verifyEmail(token, email);
  }
}
