import { Controller, Get,Post,Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dtos/createOrderDTO';

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

    @Post("/")
    createOrder(@Body() data:CreateOrderDTO){
        return this.orderService.createOrder(data);
    }
}
