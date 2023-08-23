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
// import { ErrorHandlingMiddleware } from './middlewares/ErrorHandling.middleware';


@Module({
  imports: [ NotificationModule, MenuModule,AuthModule,PrismaModule,UserModule,CategoryModule,HotelModule,OrderModule],
  controllers: [AppController],
  providers: [AppService, NotificationGateway],
})
export class AppModule  {}
