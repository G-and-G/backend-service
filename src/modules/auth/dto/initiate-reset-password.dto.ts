import { IsEmail } from 'class-validator';

export class InitiateResetPasswordDTO {
  @IsEmail()
  email: string;
}
