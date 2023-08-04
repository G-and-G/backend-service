import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';


@Module({
  imports: [ NotificationModule, MenuModule, AuthModule,PrismaModule,UserModule,CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
