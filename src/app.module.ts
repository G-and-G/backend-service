import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { HotelModule } from './hotel/hotel.module';
import { NotificationGateway } from './notification/notification.gateway';
import options from './utils/cors';
import { OrderModule } from './order/order.module';
import { ReviewModule } from './reviews/reviews.module';
import { GoogleModule } from './google/google.module';
// import { ErrorHandlingMiddleware } from './middlewares/ErrorHandling.middleware';
import { FirebaseController } from './firebase/firebase.controller';
import { PaymentModule } from './payment/payment.module';
import { PaymentService } from './payment/payment.service';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    NotificationModule,
    MenuModule,
    AuthModule,
    PrismaModule,
    UserModule,
    CategoryModule,
    HotelModule,
    ReviewModule,
    PaymentModule,
    OrderModule,
    GoogleModule
    AnalyticsModule
  ],
  controllers: [AppController, FirebaseController],

  providers: [AppService, NotificationGateway,PaymentService],
})
export class AppModule {}
