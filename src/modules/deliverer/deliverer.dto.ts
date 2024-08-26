import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDelivererDto {
  @ApiProperty({
    description: 'The first name of the deliverer',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'The last name of the deliverer',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'The email address of the deliverer',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the deliverer',
    example: 'securePassword123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UpdateDelivererDto extends PartialType(CreateDelivererDto) {
  @ApiProperty({
    description: 'The first name of the deliverer',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({
    description: 'The last name of the deliverer',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({
    description: 'The email address of the deliverer',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The password of the deliverer',
    example: 'securePassword123',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;
}

export class AssignOrderDto {
  @ApiProperty({
    description: 'The ID of the order to be assigned',
    example: 'order123',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
