import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { dot } from 'node:test/reporters';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() dot:AuthDto){
    return  this.authService.signup(dot)
  }
  @Post('signin')
  signin(){
    return  this.authService.signin()
  }
  @Get('signout')
  signout(){
    return  this.authService.signout()
  }

}
