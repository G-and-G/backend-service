import { Controller } from '@nestjs/common';

@Controller('order')
export class OrderController {
     main(){
        return "Welcome to order management!";
    }

}
