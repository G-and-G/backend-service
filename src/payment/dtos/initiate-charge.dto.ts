import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InitiateChargeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  currency: Currency;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // paymentMethod: string;
}

enum Currency {
  RWF = 'RWF',
  USD = 'USD',
}
