// payment.module.ts

import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
   PrismaModule,PaymentModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService,PrismaService],
})
export class PaymentModule {}
