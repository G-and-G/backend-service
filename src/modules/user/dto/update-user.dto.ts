import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @ApiProperty()
  firstName: string;
  @IsString()
  @ApiProperty()
  lastName: string;
}
