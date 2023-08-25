import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config().jwt.secret,
      signOptions: { expiresIn: config().jwt.expiresIn },
    }),
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
