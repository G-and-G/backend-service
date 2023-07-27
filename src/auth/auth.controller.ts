import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(){
    return 'Signup route'
  }
  @Post('signin')
  signin(){
    return 'Signin route'
  }
  @Get('signout')
  signout(){
    return 'Signout route'
  }

}
