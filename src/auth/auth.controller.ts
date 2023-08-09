import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { dot } from 'node:test/reporters';
import { AuthDto, SignInDTO } from './dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth module')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  
  signup(@Body() dot:AuthDto){
    return  this.authService.signup(dot)
  }
  @Post('signin')
  signin(@Body() dot:SignInDTO,@Req() req,@Res() res){
    return  this.authService.signin(dot ,req,res)
  }
  @Get('signout')
  signout(){
    return  this.authService.signout()
  }

}
