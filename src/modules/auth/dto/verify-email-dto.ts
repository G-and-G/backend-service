import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerifyEmailDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
}
//initiate-email-verification
export class InitiateEmailVerificationDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
}
