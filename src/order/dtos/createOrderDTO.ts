import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty decorator
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
// import { Address } from '@prisma/client';
// import {  Address } from 'src/hotel/dto/address.dto';
import { MenuItem } from '@prisma/client';
import { Type } from 'class-transformer';
import { DeliveryAddress } from './addressDTO';

export class ProductDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the menu item' }) // Add ApiProperty decorator
  menuItem_id: number;

  // Other properties
}

export class CreateOrderDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The price of the order' }) // Add ApiProperty decorator
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the customer' }) // Add ApiProperty decorator
  customer_id: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the hotel' }) // Add ApiProperty decorator
  hotel_id: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the delivery address' }) // Add ApiProperty decorator
  @Type(() => DeliveryAddress)
  deliveryAddress: DeliveryAddress;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: ProductDTO,
    description: 'Array of products in the order',
  }) // Add ApiProperty decorator
  products: MenuItem[];
}
