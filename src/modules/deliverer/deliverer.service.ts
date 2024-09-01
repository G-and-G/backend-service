import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AssignOrderDto, CreateDelivererDto, UpdateDelivererDto } from './deliverer.dto';
import { log } from 'console';

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
      return {
        status: 201,
        response: { message: 'Deliverer created successfully', deliverer },
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        response: { message: 'Failed to create deliverer', error: error.message },
      };
    }
  }

  // Update an existing deliverer
  async updateDeliverer(id: string, dto: UpdateDelivererDto) {
    try {
      const deliverer = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return {
        status: 200,
        response: { message: 'Deliverer updated successfully', deliverer },
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to update deliverer' },
      };
    }
  }

  // Delete an existing deliverer
  async deleteDeliverer(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return {
        status: 200,
        response: { message: 'Deliverer deleted successfully' },
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to delete deliverer' },
      };
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
        response: { message: 'Order assigned to deliverer successfully', assignment },
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to assign order to deliverer' },
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
          admin_hotels: { some: { id: hotelIdNumber } },
          role: 'DELIVERER',
        },
      });
      return {
        status: 200,
        response: { message: 'Deliverers retrieved successfully', data },
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to retrieve deliverers' },
      };
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
      return {
        status: 200,
        response: { message: 'Orders retrieved successfully', orders },
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to retrieve orders' },
      };
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

      const hotelIds = hotels.map(hotel => hotel.id);

      const deliverers = await this.prisma.user.findMany({
        where: {
          admin_hotels: { some: { id: { in: hotelIds } } },
          role: 'DELIVERER',
        },
      });

      return {
        status: 200,
        response: { message: 'Deliverers retrieved successfully', deliverers },
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to retrieve deliverers', error: error.message },
      };
    }
  }

}
