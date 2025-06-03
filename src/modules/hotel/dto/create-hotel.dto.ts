import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUrl, Min, Max } from 'class-validator';

class AddressDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class CreateHotelDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  address: AddressDTO;

  @IsNotEmpty()
  @IsString()
  startingWorkingTime: string;

  @IsOptional()
  @IsString()
  closingTime?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;
}