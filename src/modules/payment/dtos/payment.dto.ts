import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderPaymentDto {
  @ApiProperty({
    example: '1234567890',
    description: 'Mobile money phone number',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    enum: ['momo', 'credit_card', 'paypal'],
    description: 'Payment method',
  })
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @ApiProperty({ example: 'user123', description: 'ID of the user' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 'order123', description: 'ID of the order' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ example: 50.0, description: 'Payment amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class OrderDTO {
  @ApiProperty({
    example: 'order123',
    description: 'Unique identifier of the order',
  })
  @IsString()
  _id: string;

  @ApiProperty({
    example: 'user123',
    description: 'ID of the user who placed the order',
  })
  createdBy: string;

  // ... other order properties

  constructor(data: OrderDTO) {
    Object.assign(this, data);
  }
}

export class TenantDTO {
  @ApiProperty({
    example: 'tenant123',
    description: 'Unique identifier of the tenant',
  })
  @IsString()
  _id: string;

  @ApiProperty({ example: 'user123', description: 'ID of the tenant' })
  tenantId: string;

  // ... other tenant properties

  constructor(data: Partial<TenantDTO>) {
    Object.assign(this, data);
  }
}
