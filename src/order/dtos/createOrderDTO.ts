import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDTO{
    @IsNumber()
    @IsNotEmpty()
    price:number;

    @IsString()
    @IsNotEmpty()
    customer_id:string;

    @IsDate()
    @IsNotEmpty()
    date:Date;

    @IsString()
    @IsNotEmpty()
    address_id:string;

    @IsArray()
    products:any[];
}