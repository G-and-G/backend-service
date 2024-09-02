import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Google')
@Controller('google')
export class GoogleController {
  constructor(private readonly googleSerice: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.googleSerice.googleLogin(req);
  }
}
