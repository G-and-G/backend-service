import { Controller, Get } from '@nestjs/common';
import { Hotel } from '@prisma/client';

@Controller('menu')
export class MenuController {
    @Get('/')
    getMenu(){
       console.log("Hello")
    }

}
