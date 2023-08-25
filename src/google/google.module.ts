import { Module } from '@nestjs/common';

import { GoogleStrategy } from './google.strategy'
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy],
})
export class GoogleModule {}