import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import ApiResponse from 'src/utils/ApiResponse';
import { CreateOrderDTO } from './dtos/createOrderDTO';
// import { Address } from 'src/hotel/dto/address.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService, // private readonly hotelService: HotelService,
  ) {}

  async getOrders(): Promise<Order[]> {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          products: true, // This will include th3e associated items for each order
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
        where: { menu: { is: { menu_id: data.products[0].product.menu_id } } },
      });
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
              hotel_id: order_hotel.hotel_id,
            },
          },
          deliveryAddress: {
            create: {
              full_name: data.deliveryAddress.full_name,
              telephone: data.deliveryAddress.telephone,
              address: data.deliveryAddress.address,
              city: data.deliveryAddress.city,
              plateNumber: data.deliveryAddress.plateNumber,
              longitude: data.deliveryAddress.longitude,
              latitude: data.deliveryAddress.latitude,
            },
          },
          products: {
            create: data.products.map((product) => ({
              quantity: product.quantity,
              menuItem: {
                connect: { menuItem_id: product.product.menuItem_id },
              },
            })),
          },
        },
        include: { products: true },
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
                  menuItem: true,
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
        where: { order_id: orderId },
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
        where: { order_id: orderId },
        include: {
          products: {
            include: {
              menuItem: true,
            },
          }, // This will include the associated items for each order
          deliveryAddress: true,
          customer: true,
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
        where: { order_id: orderId },
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
  // ... other methods in your OrderService
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await this.prisma.order.delete({
        where: { order_id: orderId },
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
        where: { hotel_id: Number(hotelId) },
        include: {
          products: true, // This will include the associated items for each order
          customer: true,
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
        include: {
          admin_hotels: true,
        },
      });

      if (!user) throw new Error('User not found');

      if (user.role !== 'ADMIN') throw new Error('User is not an admin');

      return this.getOrdersForHotel(user.admin_hotels[0].hotel_id);
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to fetch orders');
    }
  }
}
