import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AssignOrderDto, CreateDelivererDto, UpdateDelivererDto } from './deliverer.dto';

@Injectable()
export class DelivererService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new deliverer for a specific hotel
  async createDeliverer(dto: CreateDelivererDto, hotelId: number) {
    try {
      const deliverer = await this.prisma.user.create({
        data: {
          ...dto,
          role: 'DELIVERER',
          admin_hotels: { connect: { id: hotelId } },  
        },
      });
      return {
        status: HttpStatus.CREATED,
        response: { message: 'Deliverer created successfully', deliverer },
      };
    } catch (error) {
      console.error('Error creating deliverer:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: { message: 'Failed to create deliverer' },
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
        status: HttpStatus.OK,
        response: { message: 'Deliverer updated successfully', deliverer },
      };
    } catch (error) {
      console.error('Error updating deliverer:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
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
        status: HttpStatus.OK,
        response: { message: 'Deliverer deleted successfully' },
      };
    } catch (error) {
      console.error('Error deleting deliverer:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
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
        status: HttpStatus.OK,
        response: { message: 'Order assigned to deliverer successfully', assignment },
      };
    } catch (error) {
      console.error('Error assigning order to deliverer:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: { message: 'Failed to assign order to deliverer' },
      };
    }
  }

  // Get all deliverers for a specific hotel
  async getDeliverersByHotel(hotelId: number) {
    try {
      const deliverers = await this.prisma.user.findMany({
        where: {
          admin_hotels: { some: { id: hotelId } },
          role: 'DELIVERER',
        },
      });
      return {
        status: HttpStatus.OK,
        response: { message: 'Deliverers retrieved successfully', deliverers },
      };
    } catch (error) {
      console.error('Error retrieving deliverers:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: { message: 'Failed to retrieve deliverers' },
      };
    }
  }
  //get assigned orders by aderiverer
  async getAssignedOrders(delivererId: string) {
    try {
      const orders = await this.prisma.assignedOrder.findMany({
        where: { user_id: delivererId },
        include: {
          order: true,
        },
      });
      return {
        status: HttpStatus.OK,
        response: { message: 'Orders retrieved successfully', orders },
      };
    } catch (error) {
      console.error('Error retrieving orders:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: { message: 'Failed to retrieve orders' },
      };
    }
  }
  
}
