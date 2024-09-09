import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationService } from './modules/notification/notification.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  getHello(): string {
    this.eventEmitter.emit('notification.send', {
      title: 'From backend',
      message: 'Hello from backend',
      userIds: ['8df7e5b4-6e8e-4a4c-8a69-97ec9793de42'],
    });
    return this.appService.getHello();
  }
}
