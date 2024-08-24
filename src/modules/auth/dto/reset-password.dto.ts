import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  newPassword: string;
}
