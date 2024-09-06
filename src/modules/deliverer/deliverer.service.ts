import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import ApiResponse from 'src/utils/ApiResponse';
import { UserService } from '../user/user.service';
import {
  AssignOrderDto,
  CreateDelivererDto,
  UpdateDelivererDto,
} from './deliverer.dto';

@Injectable()
export class DelivererService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createDeliverer(dto: CreateDelivererDto, hotelId: string) {
    try {
      await this.userService.createUser({
        firstName: dto.first_name,
        lastName: dto.last_name,
        email: dto.email,
        password: dto.password,
      });
      // update role to DELIVERER
      const hotelIdNumber = parseInt(hotelId, 10);
      if (isNaN(hotelIdNumber)) {
        throw new Error('Invalid hotelId provided');
      }
      const deliverer = await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          role: 'DELIVERER',
          hotelId: hotelIdNumber,
        },
      });
      return ApiResponse.success('Deliverer created successfully', deliverer);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addExistingDeliverer(email: string, hotelId: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new BadRequestException('User does not exist');
    try {
      const hotelIdNumber = parseInt(hotelId, 10);
      if (isNaN(hotelIdNumber)) {
        throw new Error('Invalid hotelId provided');
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          role: 'DELIVERER',
          hotelId: hotelIdNumber,
        },
      });
      return ApiResponse.success('Deliverer added successfully', user);
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
      if (error.code === 'P2002' && error.meta?.target.includes('user_id')) {
        // return {
        //   status: 400,
        //   response: {
        //     message: `Failed to assign order: Deliverer with user ID ${dto.userId} is already assigned to another order.`,
        //   },
        // };
        throw new BadRequestException(
          `Failed to assign order: Deliverer with user ID ${dto.userId} is already assigned to another order.`,
        );
      }

      console.error('Unexpected error occurred:', error);
      throw new InternalServerErrorException(
        'Failed to assign order to deliverer due to an internal server error.',
      );
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
          order: {
            include: {
              deliveryAddress: {
                include: {
                  address: true,
                },
              },
              customer: true,
              products: {
                include: {
                  menu_item: true,
                },
              },
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
