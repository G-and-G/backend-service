import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  min,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'description of the new category',
    example: 'This is a category of different drinks available',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 100, {
    message:
      'Description must be atleast 5 characters and not exceeding 100 characters',
  })
  description: string;

  @ApiProperty({ description: 'name of the category', example: 'Drinks' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'subcategories found in the given category',
    example: ['fresh juice', 'hot drinks'],
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @ApiProperty({
    description: 'url of the image to the label of the category',
    example: 'https://images.com/img.png',
  })
  @IsNotEmpty()
  image: string;
}
