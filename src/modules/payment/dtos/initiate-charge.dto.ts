import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PayWithMomoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;
}

export class PayWithCardDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/)
  cardNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{3}$/) // 3 digit cvv
  cvv: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/) // mm/yy
  expiry: string;

  @ApiProperty()
  @Matches(/^[0-9]+$/)
  pin?: string;
}

enum Currency {
  RWF = 'RWF',
  USD = 'USD',
}
