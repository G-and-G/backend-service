import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import ApiResponse from 'src/utils/ApiResponse';
import {
  AssignOrderDto,
  CreateDelivererDto,
  UpdateDelivererDto,
} from './deliverer.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class DelivererService {
  constructor(private readonly prisma: PrismaService) {}

  async createDeliverer(dto: CreateDelivererDto, hotelId: string) {
    try {
      // Convert hotelId to a number
      const hotelIdNumber = parseInt(hotelId, 10);

      // Ensure hotelId is a valid number
      if (isNaN(hotelIdNumber)) {
        throw new Error('Invalid hotelId provided');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
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
      const deliverer = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
          role: 'DELIVERER',
          hotel: { connect: { id: hotelIdNumber } },
          verification: {
            connect: {
              id: newVerification.id,
            },
          },
        },
      });
      await this.prisma.verification.update({
        where: {
          id: newVerification.id,
        },
        data: {
          user_id: deliverer.id,
        },
      });
      return ApiResponse.success('Deliverer created successfully', deliverer);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // Update an existing deliverer
  async updateDeliverer(id: string, dto: UpdateDelivererDto) {
    try {
      const deliverer = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return ApiResponse.success('Deliverer updated successfully', deliverer);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Delete an existing deliverer
  async deleteDeliverer(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return ApiResponse.success('Deliverer deleted successfully', null, 200);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Assign an order to a deliverer
  async assignOrder(dto: AssignOrderDto) {
    try {
      const assignment = await this.prisma.assignedOrder.create({
        data: {
          user_id: dto.userId,
          order_id: dto.orderId,
        },
      });
      return {
        status: 200,
        response: {
          message: 'Order assigned to deliverer successfully',
          assignment,
        },
      };
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target.includes('user_id')) {
        return {
          status: 400,
          response: {
            message: `Failed to assign order: Deliverer with user ID ${dto.userId} is already assigned to another order.`,
          },
        };
      }

      console.error('Unexpected error occurred:', error);

      return {
        status: 500,
        response: {
          message:
            'Failed to assign order to deliverer due to an internal server error.',
        },
      };
    }
  }

  // Get all deliverers for a specific hotel
  async getDeliverersByHotel(hotelId: string) {
    try {
      // Convert hotelId to a number
      const hotelIdNumber = parseInt(hotelId, 10);

      // Ensure hotelId is a valid number
      if (isNaN(hotelIdNumber)) {
        throw new Error('Invalid hotelId provided');
      }

      const data = await this.prisma.user.findMany({
        where: {
          hotel: { id: hotelIdNumber },
          role: 'DELIVERER',
        },
      });
      return ApiResponse.success('Deliverers retrieved successfully', data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Get assigned orders by a deliverer
  async getAssignedOrders(delivererId: string) {
    try {
      const orders = await this.prisma.assignedOrder.findMany({
        where: { user_id: delivererId },
        include: {
          order: true,
        },
      });
      return ApiResponse.success('Orders retrieved successfully', orders);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  // Get all deliverers managed by a specific hotel admin
  async getDeliverersByHotelAdmin(adminId: string) {
    try {
      const admin = await this.prisma.user.findUnique({
        where: {
          id: adminId,
        },
      });
      if (!admin) {
        throw new Error('Admin not found');
      }
      const deliverers = await this.prisma.user.findMany({
        where: {
          hotelId: admin.hotelId,
          role: 'DELIVERER',
        },
      });

      return ApiResponse.success(
        'Deliverers retrieved successfully',
        deliverers,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
