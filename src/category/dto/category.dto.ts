import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, ArrayUnique, IsArray, IsNotEmpty, IsString, Length, min } from "class-validator";

export class CreateCategoryDto{
    @ApiProperty({description:"description of the new category"})
    @IsString()
    @IsNotEmpty()
    @Length(5,100,{message:"Description must be atleast 5 characters and not exceeding 100 characters"})
    description:string;

    @ApiProperty({description:"name of the category"})
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @ApiProperty({description:"subcategories found in the given category",example:["fresh juice","hot drinks"]})
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    subcategories:string[];

    @IsString()
    @ApiProperty({description:"url of the image to the label of the category"})
    @IsNotEmpty()
    image:string;
}