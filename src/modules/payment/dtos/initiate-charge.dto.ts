import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InitiateChargeDto {
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
