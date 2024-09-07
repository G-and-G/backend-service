import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CreateMenuDTO {
  @IsArray()
  @ApiProperty({
    example: [
      {
        name: 'Burger',
        price: 8.99,
        quantity_available: 50,
        description: 'Delicious burger with all the fixings',
        category_id: 1,
      },
    ],
    description: 'Items to be included in the menu',
  })
  items: any[];
  @IsArray()
  @ApiProperty({ example: [1, 2] })
  categories: number[];
}
