import { ApiProperty } from '@nestjs/swagger';
import { Address, users } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class CreateHotelDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  @IsOptional()
  @IsUrl()
  @ApiProperty()
  image?: string;
  @ApiProperty()
  address?: Address;
  @ApiProperty()
  admin:users;
 






}
