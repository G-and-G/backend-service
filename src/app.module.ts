import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { MenuModule } from './modules/menu/menu.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './modules/notification/notification.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/reviews/reviews.module';
import { UserModule } from './modules/user/user.module';
// import { ErrorHandlingMiddleware } from './middlewares/ErrorHandling.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { AlgoliaModule } from './algolia/algolia.module';
import { RolesGuard } from './common/guards/role.guard';
import { FirebaseController } from './firebase/firebase.controller';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { DelivererModule } from './modules/deliverer/deliverer.module';
import { InviteModule } from './modules/invites/invite.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentService } from './modules/payment/payment.service';
import { NotificationService } from './modules/notification/notification.service';
import { HttpModule } from '@nestjs/axios';

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
    DelivererModule,
    InviteModule,
    HttpModule,
    AlgoliaModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, FirebaseController],

  providers: [
    AppService,
    NotificationService,
    PaymentService,
    RolesGuard,
    AuthGuard,
  ],
})
export class AppModule {}
