import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The phone number for mobile money payment',
    example: '0781234567',
  })
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty({
    description: 'The amount to be paid',
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The type of payment',
    example: 'mobilemoneyrw',
  })
  @IsNotEmpty()
  @IsString()
  payment_type: string;

  @ApiProperty({
    description: 'The URL to redirect after payment',
    example: 'https://your-callback-url.com',
  })
  @IsNotEmpty()
  @IsString()
  redirect_url: string;

  @ApiProperty({
    description: 'The ID of the customer making the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  customerId: string;
}

export class VerifyPaymentDto {
    @ApiProperty({ description: 'Transaction ID from Flutterwave', example: 'txn_123' })
    @IsString()
    @IsNotEmpty()
    txn_id: string;
  }