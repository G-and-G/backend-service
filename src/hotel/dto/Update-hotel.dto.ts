import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateHotelDTO {
  @IsOptional() // Name can be updated, so it's optional
  @IsString()
  name?: string;

  @IsOptional() // Image can be updated, so it's optional
  @IsUrl()
  image?: string;

  @IsOptional() // Address can be updated, so it's optional
  @IsString()
  address?: string;

  // You can include other fields that can be updated
  // For example, admin_id and menu_id may also be updatable
  @IsOptional()
  admin_id?: string;

  @IsOptional()
  menu_id?: number;
}
