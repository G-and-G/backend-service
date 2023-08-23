import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDTO } from './dtos/createOrderDTO';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  getOrders() {
    throw new Error('Method not implemented.');
  }
  async createOrder(data: CreateOrderDTO) {
    try {
      const newOrder = await this.prisma.order.create({
        data: {
            ...data,
            customer:{
                connect:{
                    id: data.customer_id
                }
            },
            deliveryAddress:{
                connect:{
                    address_id:data.address_id
                }
            }
        },
      });   
    } catch (error) {}
  }
}
