// payment.module.ts

import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { OrderService } from 'src/modules/order/order.service';
import { UserModule } from 'src/modules/user/user.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [PrismaModule, UserModule, PaymentModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, OrderService],
})
export class PaymentModule {}
