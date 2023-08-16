import { ApiProperty } from '@nestjs/swagger';
import { Address } from '@prisma/client';
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
 






}
