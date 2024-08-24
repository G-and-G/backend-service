import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalFinance(): Promise<number> {
    const orders = await this.prisma.order.findMany();
    const totalFinance = orders.reduce(
      (total, order) => total + order.price,
      0,
    );
    return totalFinance;
  }

  async getTotalClients(): Promise<number> {
    const usersWithOrders = await this.prisma.user.findMany({
      where: {
        orders: {
          some: {},
        },
      },
    });

    const totalClients = usersWithOrders.length;
    return totalClients;
  }
}
