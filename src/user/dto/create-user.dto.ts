import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Max, MaxLength, MinLength } from "class-validator";


export class RegisterDTO {
    @IsEnum(['ADMIN', 'NORMAL'])
    @ApiProperty()
    role :Role;
    @IsString()
    @MaxLength(20)
    @MinLength(3)
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;

    @IsString()
    @MaxLength(20)
    @MinLength(3)
    @ApiProperty()
    lastName: string;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @MaxLength(16)
    @MinLength(4)
    @ApiProperty()
    password: string;

}