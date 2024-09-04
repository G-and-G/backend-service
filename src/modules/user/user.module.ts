import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [CloudinaryModule, MailModule,AuthModule],
  providers: [UserService,AuthService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
