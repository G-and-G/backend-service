import { forwardRef, Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [UserModule],
  controllers: [HotelController],
  providers: [HotelService, UserService],
  exports: [HotelService],
})
export class HotelModule {}
