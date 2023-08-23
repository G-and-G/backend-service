import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDTO } from './dtos/createOrderDTO';
import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import ApiResponse from 'src/utils/ApiResponse';

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
            connect: {
              address_id: data.address_id,
            },
          },
          products: {
            connect: data.products.map(product => ({
              menuItem_id: product.menuItem_id,
            })),
          },
        },
      });
      return ApiResponse.success("Order Placed!",newOrder,201);
    } catch (error) {
      console.log(error)
      return ApiResponse.error("Order couldn't be placed!" + error.message,null,error.status);
    }
  }
}
