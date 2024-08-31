import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Order } from '@prisma/client';
import ApiResponse from 'src/utils/ApiResponse';
import { CreateOrderDTO } from './dtos/createOrderDTO';
import { OrderService } from './order.service';
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  main(): string {
    return 'Welcome to order management!';
  }

  @Get('/')
  getOrders() {
    return this.orderService.getOrders();
  }

  @Post('/newOrder')
  createOrder(@Body() data: CreateOrderDTO) {
    return this.orderService.createOrder(data);
  }
  @Get(':id')
  async getOrderById(@Param('id') orderId: string): Promise<Order | null> {
    return this.orderService.getOrderById(orderId);
  }

  @Get('/hotel/:hotelId')
  async getOrdersForHotel(@Param('hotelId') hotelId: number) {
    return this.orderService.getOrdersForHotel(hotelId);
  }

  @Get('/hotel/byAdmin/:adminId')
  async getOrdersForAdmin(@Param('adminId') adminId: string) {
    return this.orderService.getOrdersForAdmin(adminId);
  }

  @Get('user/:userId/orders') // Define the route and HTTP method
  async getOrdersForUser(@Param('userId') userId: string) {
    try {
      const userOrders = await this.orderService.getOrdersForUser(userId);
      return ApiResponse.success(
        'User orders retrieved successfully',
        userOrders,
      );
    } catch (error) {
      console.log('Error fetching user orders:', error);
      return ApiResponse.error('Error fetching user orders', error);
    }
  }
  @Put('update/:id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body() dataToUpdate: Partial<Order>,
  ): Promise<Order | null> {
    return this.orderService.updateOrder(orderId, dataToUpdate);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string): Promise<void> {
    return this.orderService.deleteOrder(orderId);
  }
  @Patch(':orderId/complete') // Define the route and HTTP method
  async markOrderCompleted(@Param('orderId', ParseUUIDPipe) orderId: string) {
    try {
      const updatedOrder = await this.orderService.markOrderCompleted(orderId);
      return ApiResponse.success(
        'Order status updated to completed',
        updatedOrder,
      );
    } catch (error) {
      console.log('Error updating order status:', error);
      return ApiResponse.error('Error updating order status', error);
    }
  }
}
