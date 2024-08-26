// payment.controller.ts

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
// import { PropertyTenantDTO } from './dto/property-tenant.dto';

// import { PropertyDTO } from './dto/property.dto';
// import { UserDTO } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import ApiResponse from 'src/utils/ApiResponse';
import { InitiateChargeDto } from './dtos/initiate-charge.dto';
import { OrderPaymentDto } from './dtos/payment.dto';
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
    return this.paymentService.afterPayment(body);
  }

  @Get('paymentStatus')
  async getPaymentStatus(@Query('paymentId') paymentId: string) {
    try {
      const payment = await this.paymentService.getPayment(paymentId);
      return ApiResponse.success('Payment status', payment, 200);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
