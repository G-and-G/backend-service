import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ url: 'ws://localhost:3000', cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('New client', client.id);
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
