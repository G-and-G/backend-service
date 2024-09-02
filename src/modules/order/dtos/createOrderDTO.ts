import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty decorator
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
// import { Address } from '@prisma/client';
// import {  Address } from 'src/hotel/dto/address.dto';
import { CartItem, MenuItem } from '@prisma/client';
import { Type } from 'class-transformer';
import { DeliveryAddress } from './addressDTO';

export class CreateOrderDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The price of the order' }) // Add ApiProperty decorator
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the customer' }) // Add ApiProperty decorator
  customer_id: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the delivery address' }) // Add ApiProperty decorator
  @Type(() => DeliveryAddress)
  deliveryAddress: DeliveryAddress;

  @IsArray()
  @ApiProperty({
    description: 'Array of products in the order',
  }) // Add ApiProperty decorator
  products: (CartItem & { product: MenuItem })[];
}
