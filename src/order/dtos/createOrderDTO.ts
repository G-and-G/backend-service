import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class ProductDTO {
    @IsNumber()
    @IsNotEmpty()
    menuItem_id: number; // Assuming menuItem_id is of number type
}

export class CreateOrderDTO {
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    customer_id: string;

    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    address_id: string;

    @IsArray()
    @ValidateNested({ each: true }) // Validate each product object
    products: ProductDTO[]; // Array of ProductDTO objects
}
