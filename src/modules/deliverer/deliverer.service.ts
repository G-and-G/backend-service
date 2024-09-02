import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import ApiResponse from 'src/utils/ApiResponse';
import {
  AssignOrderDto,
  CreateDelivererDto,
  UpdateDelivererDto,
} from './deliverer.dto';

@Injectable()
export class DelivererService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new deliverer for a specific hotel
  async createDeliverer(dto: CreateDelivererDto, hotelId: string) {
    try {
      // Convert hotelId to a number
      const hotelIdNumber = parseInt(hotelId, 10);

      // Ensure hotelId is a valid number
      if (isNaN(hotelIdNumber)) {
        throw new Error('Invalid hotelId provided');
      }

      const deliverer = await this.prisma.user.create({
        data: {
          ...dto,
          role: 'DELIVERER',
          admin_hotels: { connect: { id: hotelIdNumber } },
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
      return ApiResponse.success('Order assigned successfully', assignment);
    } catch (error) {
      throw new InternalServerErrorException(error);
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
          admin_hotels: { some: { id: hotelIdNumber } },
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
        where: {
          user_id: delivererId,
          order: { status: { not: OrderStatus.DELIVERED } },
        },
        include: {
          order: {
            include: {
              products: {
                include: {
                  menu_item: true,
                },
              },
              deliveryAddress: {
                include: {
                  address: true,
                },
              },
              customer: true,
            },
          },
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
      const hotels = await this.prisma.hotel.findMany({
        where: {
          admins: { some: { id: adminId } },
        },
        select: { id: true },
      });

      const hotelIds = hotels.map((hotel) => hotel.id);

      const deliverers = await this.prisma.user.findMany({
        where: {
          admin_hotels: { some: { id: { in: hotelIds } } },
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
