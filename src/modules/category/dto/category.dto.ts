import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '@prisma/client';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'description of the new category',
    example: 'This is a category of different drinks available',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 100, {
    message:
      'Description must be at least 5 characters and not exceeding 100 characters',
  })
  description: string;

  @ApiProperty({ description: 'name of the category', example: 'sauces' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Type either Foods or Drinks',
    example: 'Foods',
  })
  @IsNotEmpty()
  type: ProductCategory;

  @IsString()
  @ApiProperty({
    description: 'url of the image to the label of the category',
    example: 'https://images.com/img.png',
  })
  image: string;
}
