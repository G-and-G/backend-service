import { Module } from '@nestjs/common';
import { HotelService } from 'src/modules/hotel/hotel.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { HotelModule } from '../hotel/hotel.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UserModule,NotificationModule,HotelModule,HttpModule],
  controllers: [OrderController],
  providers: [OrderService, HotelService,NotificationService],
  exports: [OrderService],
})
export class OrderModule {}
