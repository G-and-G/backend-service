import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { NotificationModule } from './notification/notification.module';
import { MenuModule } from './menu/menu.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [ NotificationModule, MenuModule, AuthModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
