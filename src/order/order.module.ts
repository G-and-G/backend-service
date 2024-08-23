import { Module } from '@nestjs/common';
import { HotelService } from 'src/hotel/hotel.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [OrderService, HotelService],
  exports: [OrderService],
})
export class OrderModule {}
