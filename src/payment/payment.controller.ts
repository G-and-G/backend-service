// payment.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
// import { PropertyTenantDTO } from './dto/property-tenant.dto';

// import { PropertyDTO } from './dto/property.dto';
// import { UserDTO } from './dto/user.dto';
import { PayRentDto, PropertyDTO, PropertyTenantDTO } from './payment.dto';
import { Property, PropertyTenant, users } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('payRent')

  @Post('payRent')
  async payRent(@Body() payRentDto: PayRentDto) { // Use PayRentDto
    return this.paymentService.payRent(payRentDto);
  }
}

