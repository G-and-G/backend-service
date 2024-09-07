import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';

export class UpdateMenuItemDTO {
  @ApiProperty({ example: 13.5 })
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 'Apple' })
  @IsString()
  name?: string;

  @ApiProperty({ example: 12 })
  @IsNumber()
  quantity_available?: number;

  @ApiProperty({ example: 'Delicious apple' })
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/img.jpg' })
  @IsString()
  @IsUrl()
  image?: string;
}
