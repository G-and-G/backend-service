import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MailService } from 'src/mail/mail.service';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDTO } from './dto/create-user.dto';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Role } from '@prisma/client';
import { hash } from 'bcrypt';
import ApiResponse from 'src/utils/ApiResponse';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';

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
      const user = await this.prisma.user.create({
        data: {
          // role:dto.role,
          first_name: dto.firstName,
          last_name: dto.lastName,
          email: dto.email,
          password: hashedPassword,
        },
      });
<<<<<<< HEAD
      await this.mailService.sendWelcomeEmail({ names: `${user.first_name} ${user.last_name}`, email: user.email });
      // await this.mailService.sendInitiateEmailVerificationEmail({})
=======
      await this.mailService.sendWelcomeEmail({
        names: `${user.first_name} ${user.last_name}`,
        email: user.email,
      });
>>>>>>> cf74b221f1b68ce76b4fa654824aeb010880185f
      return ApiResponse.success('User Created successfully', user);
    } catch (error) {
      if (error.code === 'P2002') {
        const key = error.meta.target[0];
        return ApiResponse.error(
          `${key.charAt(0).toUpperCase() + key.slice(1)} already exists`,
          error,
        );
      }
      console.log(error);
      return ApiResponse.error('Internal server error', error);
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
  async updateResetToken(userId: string, resetToken: string): Promise<void> {
    try {
      const updatedUser = await this.prisma.user.updateMany({
        where: { id: userId },
        data: {},
      });
      console.log(updatedUser);
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
    } catch (error) {
      console.log('Error updating password and clearing token:', error);
      throw error;
    }
  }
  async verifyEmail(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          verification: {
            update: {
              verification_status: 'VERIFIED',
            },
          },
        },
      });

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
  deleteAll() {
  }
}
