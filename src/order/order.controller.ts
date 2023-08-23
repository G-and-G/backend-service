import { Controller, Get,Post,Body, Put, Param ,Delete} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dtos/createOrderDTO';
import { Order } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('orders')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService:OrderService){}
     main():string{
        return "Welcome to order management!";
    }
    @Get("/")
    getOrders(){
        return this.orderService.getOrders();
    }

    @Post("/")
    createOrder(@Body() data:CreateOrderDTO){
        return this.orderService.createOrder(data);
    }
    @Get(':id')
    async getOrderById(@Param('id') orderId: string): Promise<Order | null> {
      return this.orderService.getOrderById(orderId);
    }
    @Put(':id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body() dataToUpdate: Partial<Order>
  ): Promise<Order | null> {
    return this.orderService.updateOrder(orderId, dataToUpdate);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string): Promise<void> {
    return this.orderService.deleteOrder(orderId);
  }
}
