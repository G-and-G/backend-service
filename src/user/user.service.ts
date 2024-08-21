import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MailService } from 'src/mail/mail.service';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDTO } from './dto/create-user.dto';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hash } from 'bcrypt';
import ApiResponse from 'src/utils/ApiResponse';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private mailService: MailService,
  ) {}

  async createUser(dto: RegisterDTO) {
    try {
      const hashedPassword = await hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          // role:dto.role,
          first_name: dto.firstName,
          last_name: dto.lastName,
          email: dto.email,
          password: hashedPassword,
        },
      });
      // await this.mailService.sendWelcomeEmail({ names: `${user.first_name} ${user.last_name}`, email: user.email })
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
          role: 'ADMIN', // Set the role to 'admin'
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

  async grantHotelAccessToAdmin(adminId: string, hotelId: number) {
    try {
      const updatedAdmin = await this.prisma.user.update({
        where: {
          id: adminId,
        },
        data: {
          admin_hotels: {
            connect: { hotel_id: hotelId }, // Connect the admin to the specific hotel
          },
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
    const user = this.prisma.user.findUnique({
      where: {
        id,
      },
    });
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
        data: { resetToken },
      });
      console.log(updatedUser);
    } catch (error) {
      console.log('Error updating reset token:', error);
      throw error;
    }
  }
  async getUserByResetToken(resetToken: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          resetToken,
        },
      });
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
      const hashedPassword = await hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          resetToken: null, // Clear the reset token
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
}
