import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Max, MaxLength, MinLength } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @ApiProperty()
  password: string;
}
