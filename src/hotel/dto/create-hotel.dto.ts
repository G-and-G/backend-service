import { ApiProperty } from '@nestjs/swagger';
import { users } from '@prisma/client';
import { Address } from './address.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsUrl,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
      longitude:-20.2,
      street:"KN 45 ST",
      district: "Nyarugenge",
      sector: "Nyamirambo",
      cell: "Nyarufunzo",
      village: "Rwarutabura ",
    },
  })
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ApiProperty()
  @IsString()
  admin_id: string;
}
