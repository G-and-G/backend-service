import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UserModule,NotificationModule, MenuModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
