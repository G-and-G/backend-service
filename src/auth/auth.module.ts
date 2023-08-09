import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt'
import { RequestLoggingMiddleware } from 'src/middlewares/requestLogging.middleware';
import { ErrorHandlingMiddleware } from 'src/middlewares/ErrorHandling.middleware';
// import { AuthorizationMiddleware } from 'src/middlewares/authorisation.middleware';

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

    consumer
      .apply(ErrorHandlingMiddleware)
      .forRoutes('*');

    // consumer
    //   .apply(AuthorizationMiddleware)
    //   .forRoutes('auth/protected-route');
  }
}
