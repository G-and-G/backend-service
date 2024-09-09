import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sendNotificationToClient } from './notify';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { RESPONSE_PASSTHROUGH_METADATA } from '@nestjs/common/constants';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEvent } from 'src/events/notification.event';
@Injectable()
export class NotificationService {
  private readonly ONE_SIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
  private readonly ONE_SIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
  private readonly ONE_SIGNAL_API_URL =
    'https://onesignal.com/api/v1/notifications';

  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}
  @OnEvent('notification.send')
  async sendNotification(
    event: NotificationEvent,
  ): Promise<AxiosResponse<any>> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          id: {
            in: event.userIds,
          },
        },
        include: {
          devices: true,
        },
      });
      if (users.length <= 0) {
        throw new Error('Users not found');
      }
      const oneSignalPlayerIds = users.reduce((acc, user) => {
        return acc.concat(
          user.devices.map((device) => device.oneSignalPlayerId),
        );
      }, []);

      console.log('ids', oneSignalPlayerIds);

      const notificationData = {
        app_id: this.ONE_SIGNAL_APP_ID,
        contents: { en: event.message },
        headings: { en: event.title },
        include_subscription_ids: oneSignalPlayerIds, // send to specific users
        data: {
          redirect_url: event.redirect_url,
          item: event.item,
        },
      };

      console.log('API KEY', this.ONE_SIGNAL_API_KEY);
      const response = await lastValueFrom(
        this.httpService.post(this.ONE_SIGNAL_API_URL, notificationData, {
          headers: {
            Authorization: `Basic ${this.ONE_SIGNAL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      await this.prisma.notification.create({
        data: {
          title: event.title,
          content: event.message,
          type: NotificationType.OTHER,
          receivers: {
            connect: users.map((user) => ({ id: user.id })),
          },
        },
      });

      console.log('Notification sent!', response.data);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error sending notification: ${error.response?.data || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
