import { Body, Controller, Post, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './payment.dto';


@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a payment' })
  @ApiResponse({ status: 200, description: 'Payment initiated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async initiatePayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.initiatePayment(createPaymentDto);
  }

  @Put('verify/:txn_id')
  @ApiOperation({ summary: 'Verify a payment' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async verifyPayment(@Param('txn_id') txn_id: string) {
    return this.paymentService.verifyPayment(txn_id);
  }
}
