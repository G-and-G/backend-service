import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateMenuItemDTO {
  @IsNumber()
  @ApiProperty({ example: 13.5 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'Apple' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @IsNotEmpty()
  quantity_available: number;

  @ApiProperty({ example: 'Delicious apple' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://example.com/img.jpg' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty()
  @IsNumber()
  hotel_id: number;
}
