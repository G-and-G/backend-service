import { Controller, Param, Post, Res } from '@nestjs/common';
import ApiResponse from 'src/utils/ApiResponse';

@Controller('firebase')
export class FirebaseController {
  @Post('/:token')
  async receiveToken(@Param('token') token: string, @Res() res) {
   try {
    process.env['FIREBASE_TOKEN'] = token;
    console.log(process.env.FIREBASE_TOKEN);
    return ApiResponse.success("Token received",null,200);
   } catch (error) {
    return ApiResponse.error("Something went wrong" + error.message,null,error.status)
   }

  }
}
