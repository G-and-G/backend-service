import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sendNotificationToClient } from './notify';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
@Injectable()
export class NotificationService {
  private readonly ONE_SIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID';
  private readonly ONE_SIGNAL_API_KEY = 'YOUR_ONESIGNAL_REST_API_KEY';
  private readonly ONE_SIGNAL_API_URL =
    'https://onesignal.com/api/v1/notifications';

  constructor(private httpService: HttpService) {}

  async sendNotification(
    title: string,
    message: string,
    userIds: string[], // OneSignal Player/User ID
    redirect_url?: string,
    item?: object,
  ): Promise<AxiosResponse<any>> {
    const notificationData = {
      app_id: this.ONE_SIGNAL_APP_ID,
      contents: { en: message },
      headings: { en: title },
      include_player_ids: userIds, // send to specific users
      data: {
        redirect_url,
        item,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(this.ONE_SIGNAL_API_URL, notificationData, {
          headers: {
            Authorization: `Basic ${this.ONE_SIGNAL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error sending notification: ${error.response?.data || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
