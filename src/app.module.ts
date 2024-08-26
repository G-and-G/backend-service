import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { MenuModule } from './modules/menu/menu.module';
import { NotificationGateway } from './modules/notification/notification.gateway';
import { NotificationModule } from './modules/notification/notification.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/reviews/reviews.module';
import { UserModule } from './modules/user/user.module';
// import { ErrorHandlingMiddleware } from './middlewares/ErrorHandling.middleware';
import { FirebaseController } from './firebase/firebase.controller';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentService } from './modules/payment/payment.service';
import { RolesGuard } from './common/guards/role.guard';
import { AuthGuard } from './modules/auth/guards/auth.guard';

@Module({
  imports: [
    NotificationModule,
    MenuModule,
    AuthModule,
    PrismaModule,
    UserModule,
    CategoryModule,
    HotelModule,
    PaymentModule,
    ReviewModule,
    PaymentModule,
    OrderModule,
    // GoogleModule,
    AnalyticsModule,
  ],
  controllers: [AppController, FirebaseController],

  providers: [AppService, NotificationGateway, PaymentService,RolesGuard,AuthGuard],
})
export class AppModule {}
