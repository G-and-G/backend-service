import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDTO } from './dto/create-user.dto';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { log } from 'console';
import ApiResponse from 'src/utils/ApiResponse';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createUser(dto: RegisterDTO) {
    try {
      const hashedPassword = await hash(dto.password, 10);
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (existingUser) {
        throw new Error('Email is in use!');
      }
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const newVerification = await this.prisma.verification.create({
        data: {
          user_id: '',
          verificationToken: verificationCode, // Generate a secure random token
          verificationTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      const user = await this.prisma.user.create({
        data: {
          // role:dto.role
          verification: {
            connect: {
              id: newVerification.id,
            },
          },
          first_name: dto.firstName,
          last_name: dto.lastName,
          email: dto.email,
          password: hashedPassword,
        },
      });
      await this.prisma.verification.update({
        where: {
          id: newVerification.id,
        },
        data: {
          user_id: user.id,
        },
      });
      await this.mailService.sendWelcomeEmail({
        names: `${user.first_name} ${user.last_name}`,
        email: user.email,
      });
      await this.mailService.sendInitiateEmailVerificationEmail({
        email: user.email,
        verificationCode,
        names: `${user.first_name} ${user.last_name}`,
      });
      return ApiResponse.success('User Created successfully', user);
    } catch (error) {
      if (error.code === 'P2002') {
        const key = error.meta.target[0];
        ApiResponse.error(
          `${key.charAt(0).toUpperCase() + key.slice(1)} already exists`,
          error,
        );
      }
      console.log(error);
      ApiResponse.error('Internal server error', error);
    }
  }
  async makeUserAdmin(userId: string) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: Role.HOTEL_ADMIN, // Set the role to 'admin'
        },
      });

      return ApiResponse.success(
        'User role updated to admin successfully',
        updatedUser,
      );
    } catch (error) {
      console.log('Error updating user role:', error);
      return ApiResponse.error('Error updating user role', error);
    }
  }
  async updateUser(userId: string, updateDTO: UpdateUserDTO) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          first_name: updateDTO.firstName,
          last_name: updateDTO.lastName,
        },
      });
      return ApiResponse.success('User updated successfully', updatedUser);
    } catch (err) {
      console.error('Error updating user', err);
      return ApiResponse.error('Error updating user', err.message);
    }
  }
  async makeUserSuperAdmin(userId: string) {
    try {
      const updateUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: 'SUPER_ADMIN',
        },
      });

      return ApiResponse.success(
        'User role updated to Super Admin successfully',
        updateUser,
      );
    } catch (error) {
      console.log('Error updating user role:', error);
      return ApiResponse.error('Error updating user role', error);
    }
  }

  async grantHotelAccessToAdmin(adminId: string, hotelId: number) {
    try {
      const updatedAdmin = await this.prisma.user.update({
        where: {
          id: adminId,
        },
        data: {
          hotelId: hotelId,
        },
      });

      return ApiResponse.success(
        'Admin granted access to hotel successfully',
        updatedAdmin,
      );
    } catch (error) {
      console.log('Error granting hotel access to admin:', error);
      return ApiResponse.error('Error granting hotel access to admin', error);
    }
  }
  async getUserById(id: string) {
    console.log('user id from req =', id);
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        hotel: true,
      },
    });
    console.log('user', user);
    if (!user) {
      throw new BadRequestException("User doesn't exist");
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      console.log('Error getting all users:', error);
      throw error;
    }
  }

  async searchUsers(query: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            {
              first_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              last_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
      return users;
    } catch (error) {
      console.log('Error searching users:', error);
      throw error;
    }
  }

  async deleteUserById(id: string) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return deletedUser;
    } catch (error) {
      console.log('Error deleting user:', error);
      throw error;
    }
  }
  async updateResetToken(userId: string, resetToken: string) {
    try {
      const userResetToken = await this.prisma.passwordReset.findFirst({
        where: {
          user_id: userId,
        },
      });
      console.log(userResetToken);
      return userResetToken;
    } catch (error) {
      console.log('Error updating reset token:', error);
      throw error;
    }
  }
  async getUserByResetToken(resetToken: string) {
    try {
      const user = await this.prisma.user.findFirst({});
      return user;
    } catch (error) {
      console.log('Error getting user by reset token:', error);
      throw error;
    }
  }

  async updatePasswordAndClearToken(
    userId: string,
    newPassword: string,
  ): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: newPassword,
        },
      });

      await this.prisma.passwordReset.deleteMany({
        where: {
          user_id: userId,
        },
      });
    } catch (error) {
      console.log('Error updating password and clearing token:', error);
      throw error;
    }
  }
  async verifyEmail(token: string, email: string): Promise<ApiResponse> {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    try {
      const verification = await this.prisma.verification.findFirst({
        where: {
          verificationToken: token,
        },
      });

      if (Number(verification.verificationTokenExpiry) < Date.now()) {
        throw new BadRequestException('Verification code has expired!');
      }

      const user = await this.prisma.user.update({
        where: { email },
        data: {
          verification: {
            update: {
              verification_status: 'VERIFIED',
            },
          },
        },
      });

      return ApiResponse.success('Email Verified successfully!', user);
    } catch (error) {
      console.log('Error verifying email:', error);
      throw error;
    }
  }

  async deleteAll() {
    try {
      await this.prisma.user.deleteMany();
      return ApiResponse.success('Delete all users');
    } catch (error) {
      log(error);
      ApiResponse.error('Error deleting all', error.message, error.status);
    }
  }
}
