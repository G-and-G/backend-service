import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { AssignOrderDto, CreateDelivererDto, UpdateDelivererDto } from './deliverer.dto';

@Injectable()
export class DelivererService {
  constructor(private prisma: PrismaService) {}

  async createDeliverer(hotelId: string, createDelivererDto: CreateDelivererDto) {
    try {
      console.log('CreateDeliverer DTO:', createDelivererDto);

      const hotel = await this.prisma.hotel.findUnique({
        where: { hotel_id: Number(hotelId) },
      });

      if (!hotel) {
        return {
          status: 404,
          response: { message: 'Hotel not found' },
        };
      }

      const hashedPassword = await bcrypt.hash(createDelivererDto.password, 10);

      const deliverer = await this.prisma.deliverer.create({
        data: {
          user: {
            create: {
              first_name: createDelivererDto.first_name,
              last_name: createDelivererDto.last_name,
              email: createDelivererDto.email,
              password: hashedPassword,
              role: 'DELIVERER',
            },
          },
         
        },
        include: {
          user: true,
        },
      });

      return {
        status: 201,
        response: { message: 'Deliverer created successfully', deliverer },
      };
    } catch (error) {
      console.error('Error creating deliverer:', error);
      throw new InternalServerErrorException('Error creating deliverer');
    }
  }

  async getDelivererById(delivererId: string) {
    try {
      console.log('Get Deliverer By ID:', delivererId);

      const deliverer = await this.prisma.deliverer.findUnique({
        where: { id: delivererId },
        include: { user: true },
      });

      if (!deliverer) {
        return {
          status: 404,
          response: { message: 'Deliverer not found' },
        };
      }

      return {
        status: 200,
        response: { deliverer },
      };
    } catch (error) {
      console.error('Error retrieving deliverer by ID:', error);
      throw new InternalServerErrorException('Error retrieving deliverer');
    }
  }

  async updateDeliverer(delivererId: string, updateDelivererDto: UpdateDelivererDto) {
    try {
      console.log('UpdateDeliverer DTO:', updateDelivererDto);

      const deliverer = await this.prisma.deliverer.findUnique({
        where: { id:delivererId },
      });

      if (!deliverer) {
        return {
          status: 404,
          response: { message: 'Deliverer not found' },
        };
      }

      const hashedPassword = updateDelivererDto.password
        ? await bcrypt.hash(updateDelivererDto.password, 10)
        : undefined;

      const updatedDeliverer = await this.prisma.deliverer.update({
        where: { id:delivererId },
        data: {
          user: {
            update: {
              first_name: updateDelivererDto.first_name,
              last_name: updateDelivererDto.last_name,
              email: updateDelivererDto.email,
              password: hashedPassword,
            },
          },
        },
        include: { user: true },
      });

      return {
        status: 200,
        response: { message: 'Deliverer updated successfully', updatedDeliverer },
      };
    } catch (error) {
      console.error('Error updating deliverer:', error);
      throw new InternalServerErrorException('Error updating deliverer');
    }
  }

  async deleteDeliverer(delivererId: string) {
    try {
      console.log('Delete Deliverer By ID:', delivererId);

      const deliverer = await this.prisma.deliverer.findUnique({
        where: { id: delivererId },
      });

      if (!deliverer) {
        return {
          status: 404,
          response: { message: 'Deliverer not found' },
        };
      }

      await this.prisma.deliverer.delete({
        where: { id: delivererId},
      });

      return {
        status: 200,
        response: { message: 'Deliverer deleted successfully' },
      };
    } catch (error) {
      console.error('Error deleting deliverer:', error);
      throw new InternalServerErrorException('Error deleting deliverer');
    }
  }

  async assignOrder(delivererId: string, assignOrderDto: AssignOrderDto) {
    try {
      console.log('AssignOrder DTO:', assignOrderDto);

      const deliverer = await this.prisma.deliverer.findUnique({
        where: { id: delivererId },
      });

      if (!deliverer) {
        return {
          status: 404,
          response: { message: 'Deliverer not found' },
        };
      }

      const order = await this.prisma.order.findUnique({
        where: { order_id: assignOrderDto.orderId},
      });

      if (!order) {
        return {
          status: 404,
          response: { message: 'Order not found' },
        };
      }

      if (order.deliverer_id) {
        return {
          status: 400,
          response: { message: 'Order already assigned' },
        };
      }

      const updatedOrder = await this.prisma.order.update({
        where: { order_id: assignOrderDto.orderId },
        data: {
          deliverer_id: delivererId,
          status: 'COMPLETED', // Assuming you have a status field
        },
      });

      return {
        status: 200,
        response: { message: 'Order assigned successfully', updatedOrder },
      };
    } catch (error) {
      console.error('Error assigning order:', error);
      throw new InternalServerErrorException('Error assigning order');
    }
  }

  async getOrdersByDeliverer(delivererId: string) {
    try {
      console.log('Get Orders By Deliverer ID:', delivererId);

      const deliverer = await this.prisma.deliverer.findUnique({
        where: { id:delivererId},
      });

      if (!deliverer) {
        return {
          status: 404,
          response: { message: 'Deliverer not found' },
        };
      }

      const orders = await this.prisma.order.findMany({
        where: { deliverer_id: delivererId },
      });

      return {
        status: 200,
        response: { orders },
      };
    } catch (error) {
      console.error('Error retrieving orders by deliverer:', error);
      throw new InternalServerErrorException('Error retrieving orders');
    }
  }
}
