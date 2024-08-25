import { Injectable } from '@nestjs/common';
import { sendNotificationToClient } from './notify';
@Injectable()
export class NotificationService {
sendNotification(tokens,data){
      sendNotificationToClient(tokens, data);
}
}
