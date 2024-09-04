import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class VerifyEmailDTO{
    @ApiProperty()
    @IsEmail()
    email:string;
}