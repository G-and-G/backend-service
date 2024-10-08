import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Address } from './address.dto';

export class CreateHotelDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  @IsOptional()
  @IsUrl()
  @ApiProperty()
  image?: string;
  @ApiProperty({
    example: {
      latitude: 12.3,
      longitude: -20.2,
      street: 'KN 45 ST',
      name: 'Nyarugenge, Nyamirambo, Nyarufunzo',
      country: 'Rwanda',
    },
  })
  @ValidateNested()
  @Type(() => Address)
  address: Address;
  @ApiProperty({
    description: 'The starting working time of the hotel (in HH:mm format)',
    example: '08:00',
    type: String,
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startWorkingTime must be in the format HH:mm',
  })
  startingWorkingTime: string;

  @ApiProperty({
    description: 'The closing time of the hotel (in HH:mm format)',
    example: '22:00',
    type: String,
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'closingTime must be in the format HH:mm',
  })
  closingTime: string;

  @ApiProperty({
    description: "The hotel's rating meaning the number of stars",
    example: 4,
    type: Number,
  })
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsString()
  subaccount_id: string;
}
