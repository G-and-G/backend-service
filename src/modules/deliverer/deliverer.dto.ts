// create-deliverer.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateDelivererDto {
  @ApiProperty({
    description: 'The first name of the deliverer',
    example: 'John',
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'The last name of the deliverer',
    example: 'Doe',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'The email address of the deliverer',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  // @ApiProperty({
  //   description: 'The Phone number of the deliverer',
  //   example: '08123456789',
  // })
  // phone_number: string; // Add this property after in schema

  @ApiProperty({
    description: 'The password for the deliverer account',
    example: 'securepassword123',
  })
  @IsString()
  password: string;
}

export class UpdateDelivererDto {
  @ApiPropertyOptional({
    description: 'The first name of the deliverer',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({
    description: 'The last name of the deliverer',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({
    description: 'The email address of the deliverer',
    example: 'johndoe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The password for the deliverer account',
    example: 'newsecurepassword123',
  })
  @IsOptional()
  @IsString()
  password?: string;
}

// assign-order.dto.ts

export class AssignOrderDto {
  @ApiProperty({
    description: 'The ID of the deliverer',
    example: 'uuid-of-deliverer',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The ID of the order to be assigned',
    example: 'uuid-of-order',
  })
  @IsString()
  orderId: string;
}
