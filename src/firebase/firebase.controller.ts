import { Controller, Param, Post } from '@nestjs/common';

@Controller('firebase')
export class FirebaseController {
  @Post('/:token')
  async receiveToken(@Param('token') token: string) {
    process.env['FIREBASE_TOKEN'] = token;
    console.log(process.env.FIREBASE_TOKEN);
  }
}
