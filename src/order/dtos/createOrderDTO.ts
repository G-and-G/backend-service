import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty decorator
// import { Address } from '@prisma/client';
// import {  Address } from 'src/hotel/dto/address.dto';
import { Address, DeliveryAddress } from './addressDTO';
import { Type } from 'class-transformer';
import { CreateMenuItemDTO } from 'src/menu/dtos/createMenuItemDTO';
import { Menu, MenuItem } from '@prisma/client';

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
  deliveryAddress:DeliveryAddress ;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: ProductDTO,
    description: 'Array of products in the order',
  }) // Add ApiProperty decorator
  products: MenuItem[];
}
