import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt'
import { RequestLoggingMiddleware } from 'src/middlewares/requestLogging.middleware';

@Module({
  imports:[JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
  
})
export class AuthModule  implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggingMiddleware)
      .forRoutes('*');
  }
}
