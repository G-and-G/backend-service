import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}
  async login(dto: LoginDTO) {
    console.log('Login DTO: ', dto);
    const user = await this.userService.getUserByEmail(dto.email);

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

    const token = this.jwtService.sign(
      { id: user.id, role: user.role },
      { expiresIn: '1d' },
    );

    return {
      status: 200,
      response: { message: 'Login successful', token, user },
    };
  }
  async adminAuth(dto: LoginDTO) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (user.role !== 'ADMIN') {
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
  async initiateResetPassword(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return;
    }

    const resetToken = randomBytes(32).toString('hex');

    await this.userService.updateResetToken(user.id, resetToken);

    await this.mailService.sendResetPasswordEmail({
      email: user.email,
      token: resetToken,
      names: `${user.first_name} ${user.last_name}`,
    });
  }
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.getUserByResetToken(token);

    if (!user) {
      return;
    }

    const hashedPassword = hashSync(newPassword, 10);

    await this.userService.updatePasswordAndClearToken(user.id, hashedPassword);
  }

  async initiateEmailVerification(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return;
    }

    const verificationCode = randomBytes(6).toString('hex');

    await this.mailService.sendInitiateEmailVerificationEmail({
      email: user.email,
      verificationCode,
      names: `${user.first_name} ${user.last_name}`,
    });

    return { message: 'Email verification initiated' };
  }

  async verifyEmail(userId: string): Promise<boolean> {
    try {
      const user = await this.userService.verifyEmail(userId);

      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error verifying email:', error);
      throw error;
    }
  }
}
