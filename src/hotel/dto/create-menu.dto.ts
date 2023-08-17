import { IsArray } from "class-validator";

export class CreateMenuDTO{
    @IsArray()
    items: any[];
    @IsArray()
    categories:Number[]
}