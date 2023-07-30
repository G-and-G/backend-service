import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class AuthDto {
  
  @IsEmail()
  public email: string;
  @IsString()
  public fullName: string;
  @IsString()
  public telephone: string;
  @IsString()
  public gender: string;
  @IsString()
  public username: string;


  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Passowrd has to be at between 3 and 20 chars' })
  public password: string;
}

export class SignInDTO {
  @IsEmail()
  @IsString()
  public email: string;
  @IsString()
  public password: string;
}