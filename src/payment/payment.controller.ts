// payment.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
// import { PropertyTenantDTO } from './dto/property-tenant.dto';

// import { PropertyDTO } from './dto/property.dto';
// import { UserDTO } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { InitiateChargeDto } from './dtos/initiate-charge.dto';
import { OrderPaymentDto } from './dtos/payment.dto';
import ApiResponse from 'src/utils/ApiResponse';
@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('payRent')

  //   @Post('payRent')
  //   async payRent(@Body() payRentDto: PayRentDto) { // Use PayRentDto
  //     return this.paymentService.payRent(payRentDto);
  //   }
  @Post('payOrder')
  async payOrder(@Body() orderPaymentDto: OrderPaymentDto) {
    // Use OrderPaymentDto
    return this.paymentService.payOrder(orderPaymentDto);
  }

  @Post('initiatePayment')
  async initiatePayment(@Body() init: InitiateChargeDto) {
    console.log(init);
    return this.paymentService.initiatePayment(init);
  }

  @Post('payWithCard')
  async payWithCard() {
    return this.paymentService.payWithCard();
  }

  @Post('webhook')
  async getWebhook(@Body() body: any) {
    console.log('webhook', body);
    if (body.event !== 'charge.completed') {
      return ApiResponse.error('Payment not successful', null, 200);
    }
    const data = this.paymentService.afterPayment(body.data);
    return ApiResponse.success('Payment successful', data, 200);
  }
}
