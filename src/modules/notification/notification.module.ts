import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [UserModule, HttpModule],
  controllers: [NotificationController],
  providers: [NotificationService, UserService],
})
export class NotificationModule {}
