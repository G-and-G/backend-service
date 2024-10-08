import { BadRequestException, Injectable } from '@nestjs/common';
import { Order, Role } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import ApiResponse from 'src/utils/ApiResponse';
import { CreateOrderDTO } from './dtos/createOrderDTO';
import { NotificationService } from '../notification/notification.service';
import { HotelService } from '../hotel/hotel.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { Address } from 'src/hotel/dto/address.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2, // private readonly hotelService: HotelService,
  ) {}

  async getOrders(): Promise<Order[]> {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          products: true, // This will include th3e associated items for each order
          assignment: true,
        },
      });

      return orders;
    } catch (error) {
      // Handle errors here
      console.log(error);

      throw new Error('Unable to fetch orders');
    }
  }

  async createOrder(data: CreateOrderDTO) {
    try {
      if (!data.products.length)
        throw new BadRequestException('No items in cart');
      console.log('data.products[0].product', data.products[0].product);
      const order_hotel = await this.prisma.hotel.findFirst({
        where: { menu: { is: { id: data.products[0].product.menu_id } } },
      });
      if (!order_hotel) throw new BadRequestException('Hotel not found');
      const price = data.products.reduce((prev, curr) => {
        return prev + curr.product.price * curr.quantity;
      }, 0);

      const newOrder = await this.prisma.order.create({
        data: {
          price,
          customer: {
            connect: {
              id: data.customer_id,
            },
          },
          hotel: {
            connect: {
              id: order_hotel.id,
            },
          },
          deliveryAddress: {
            create: {
              full_name: data.deliveryAddress.full_name,
              telephone: data.deliveryAddress.telephone,
              plateNumber: data.deliveryAddress.plateNumber,
              address: {
                create: {
                  name: data.deliveryAddress.name,
                  city: data.deliveryAddress.city,
                  longitude: data.deliveryAddress.longitude,
                  latitude: data.deliveryAddress.latitude,
                },
              },
            },
          },
          products: {
            create: data.products.map((product) => ({
              quantity: product.quantity,
              menu_item: {
                connect: { id: product.product.id },
              },
            })),
          },
        },
        include: { products: true, customer: true, hotel: true },
      });
      let message: string = `${newOrder.customer.first_name} ${newOrder.customer.last_name} sent in a new Order, Make sure to check it out!`;
      let hotel = await this.prisma.hotel.findFirst({
        where: {
          id: newOrder.hotel.id,
        },
        include: {
          admins: true,
        },
      });
      let adminsIds = hotel.admins.map((admin) => admin.id);
      await this.eventEmitter.emit('notification.send', {
        message,
        userIds: adminsIds,
      });
      return ApiResponse.success('order placed successfully', newOrder, 201);
    } catch (error) {
      console.log('errorrrrrrrrrrr', error);
      throw ApiResponse.error('error placing order', error, 500);
    }
  }

  async getOrdersForUser(userId) {
    try {
      const userOrders = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          orders: {
            include: {
              deliveryAddress: true,
              products: {
                include: {
                  menu_item: true,
                },
              },
            },
          },
        },
      });

      if (!userOrders) {
        return {
          status: 404,
          Response: { message: 'User not found' },
        };
      }

      return {
        status: 200,
        Response: userOrders.orders,
      };
    } catch (error) {
      console.log('errorrrrrrrrrrr', error);
      return {
        status: 500,
        Response: { message: 'error fetching orders', error },
      };
    }
  }

  async updateOrder(
    orderId: string,
    dataToUpdate: Partial<Order>,
  ): Promise<Order | null> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: dataToUpdate,
      });

      return updatedOrder;
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to update order');
    }
  }
  async getOrderById(orderId: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          products: {
            include: {
              menu_item: true,
            },
          }, // This will include the associated items for each order
          deliveryAddress: true,
          customer: true,
          assignment: true,
        },
        // Include any related data if needed
      });

      return order;
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to fetch order by ID');
    }
  }
  async markOrderCompleted(orderId: string): Promise<Order> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'COMPLETED', // Set the status to 'Completed'
        },
      });

      return updatedOrder;
    } catch (error) {
      console.log('Error updating order status:', error);
      throw new Error('Error updating order status');
    }
  }

  async markOrderDelivered(orderId: string): Promise<Order> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'DELIVERED', // Set the status to 'Completed'
        },
      });

      return updatedOrder;
    } catch (error) {
      console.log('Error updating order status:', error);
      throw new Error('Error updating order status');
    }
  }

  // ... other methods in your OrderService
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await this.prisma.order.delete({
        where: { id: orderId },
        include: {
          products: true, // This will include the associated items for each order
        },
      });
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to delete order');
    }
  }

  async getOrdersForHotel(hotelId: number): Promise<Order[]> {
    try {
      const orders = await this.prisma.order.findMany({
        where: { hotel_id: hotelId },
        include: {
          products: true, // This will include the associated items for each order
          customer: true,
          assignment: true,
        },
      });

      return orders;
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to fetch orders');
    }
  }

  async getOrdersForAdmin(adminId: string): Promise<Order[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: adminId },
      });

      if (!user) throw new Error('User not found');

      if (user.role !== Role.HOTEL_ADMIN)
        throw new Error('User is not an admin');

      return this.getOrdersForHotel(user.hotelId);
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to fetch orders');
    }
  }
}
