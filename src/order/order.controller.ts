import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService:OrderService){}
     main():string{
        return "Welcome to order management!";
    }
    @Get("/")
    getOrders(){
        return this.orderService.getOrders();
    }
}
