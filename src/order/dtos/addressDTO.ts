import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, Max, Length } from 'class-validator';

export class Address {
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude: number;

  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude: number;

  @IsString({ message: 'Street must be a string' })
  street: string;

  @IsString({ message: 'District must be a string' })
  district: string;

  @IsString({ message: 'Sector must be a string' })
  sector: string;

  @IsString({ message: 'Cell must be a string' })
  cell: string;

  @IsString({ message: 'Village must be a string' })
  village: string;
  @IsNumber()
  @ApiProperty({ description: 'ID of the hotel' })
  hotel_id: number;

}
