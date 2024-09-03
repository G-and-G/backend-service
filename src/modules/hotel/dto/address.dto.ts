import { IsNumber, IsString, Min, Max, Length } from 'class-validator';

export class Address {
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude: number;

  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude: number;

  @IsString({ message: 'Country must be a string' })
  country: string;
  @IsString({ message: 'City must be a string' })
  city: string;
  @IsString({ message: 'Street must be a string' })
  street: string;
  @IsString({ message: 'Name must be a string' })
  name: string;
}
