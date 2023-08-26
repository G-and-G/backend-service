import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PayRentDto {
    @ApiProperty({ example: '1234567890', description: 'Mobile money phone number' })
    @IsNotEmpty()
    @IsString()
    momoPhoneNumber: string;
  
    @ApiProperty({ enum: ['momo', 'other'], description: 'Payment method' })
    @IsNotEmpty()
    @IsString()
    paymentMethod: string;
  
    @ApiProperty({ example: 'user123', description: 'ID of the user' })
    @IsNotEmpty()
    @IsString()
    userId: string;
  
    @ApiProperty({ example: 'property123', description: 'ID of the property tenant' })
    @IsNotEmpty()
    @IsString()
    propertyTenantId: string;
  }
  

export class PropertyDTO {
  @ApiProperty({ example: 1, description: 'Unique identifier of the property' })
  @IsNumber()
  _id: number;

  @ApiProperty({ example: 'user123', description: 'ID of the user who posted the property' })
  postedBy: string;

  // ... other properties
  
  constructor(data: PropertyDTO) {
    Object.assign(this, data);
  }
}

export class PropertyTenantDTO {
  @ApiProperty({ example: 1, description: 'Unique identifier of the property tenant' })
  _id: number;

  @ApiProperty({ example: 'user123', description: 'ID of the tenant' })
  TenantId: string;

  @ApiProperty({ example: 'property123', description: 'ID of the property' })
  PropertyId: string;

  @ApiProperty({ enum: ['Approved', 'Pending'], description: 'Status of the property tenant' })
  Status: string;

  @ApiProperty({ example: 1000, description: 'Rent amount' })
  rentAmount: number;

  // ... other properties
  
  constructor(data: Partial<PropertyTenantDTO>) {
    Object.assign(this, data);
  }
}
