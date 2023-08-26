import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDTO } from './dtos/createOrderDTO';
import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import ApiResponse from 'src/utils/ApiResponse';
// import { Address } from 'src/hotel/dto/address.dto';
import { Address } from './dtos/addressDTO';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(): Promise<Order[]> {
    try {
      const orders = await this.prisma.order.findMany({
        // Specify any additional options or filters here if needed
      });

      return orders;
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to fetch orders');
    }
  }

  async createOrder(data: CreateOrderDTO) {
    try {
      const newOrder = await this.prisma.order.create({
        data: {
          price: data.price,
          customer: {
            connect: {
              id: data.customer_id,
            },
          },
          date: data.date,
          deliveryAddress: {
            create: {
              latitude: data.deliveryAddress.latitude,
              longitude: data.deliveryAddress.longitude,
              street: data.deliveryAddress.street,
              district: data.deliveryAddress.district,
              sector: data.deliveryAddress.sector,
              cell: data.deliveryAddress.cell,
              village: data.deliveryAddress.village,
              hotel: {
                connect: {
                  hotel_id: data.deliveryAddress.hotel_id, 
                },
              },
             
            },

          },
          
          products: {
            connect: data.products.map((product) => ({
              menuItem_id: product.menuItem_id,
            })),
          },
        },
      });
      return ApiResponse.success('Order Placed!', newOrder, 201);
    } catch (error) {
      console.log(error);
      return ApiResponse.error(
        "Order couldn't be placed!" + error.message,
        null,
        error.status,
      );
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
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { order_id: orderId },
        // Include any related data if needed
      });

      return order;
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to fetch order by ID');
    }
  }

  // ... other methods in your OrderService
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await this.prisma.order.delete({
        where: { order_id: orderId },
      });
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to delete order');
    }
  }
}
