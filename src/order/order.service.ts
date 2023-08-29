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
          
          deliveryAddress: {
            create: {
              full_name: data.deliveryAddress.full_name,
              telephone: data.deliveryAddress.telephone,
              address: data.deliveryAddress.address,
              city: data.deliveryAddress.city,
              
            
            },
          },
          products: {
            connect: data.products.map((product) => ({
              menuItem_id: product.menuItem_id,
            })),
          },
        },
        
      });
    
      
      return {
        status: 201,
        Response: {messager:"order placed successfully",newOrder},
      };
      console.log("dataaaaaa",data.products);

    } catch (error) {
      console.log("errorrrrrrrrrrr",error);
      return {
        status: 500,
        Response: {messager:"order not placed ",error},
        
      }
        
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
      });
    } catch (error) {
      // Handle errors here
      throw new Error('Unable to delete order');
    }
  }
}
