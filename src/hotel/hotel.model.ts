import { Prisma } from "@prisma/client";
import { IsString } from "class-validator";

export class Hotel implements Prisma.HotelCreateInput{
    
    name: string;
    menu_id: number;
    rating: number;
    lastMonthOrders: number;
    ThisWeekOrders: number;
    startingWorkingTime: string | Date;
    endingWorkingTime: string | Date; 
    admin: Prisma.UserCreateNestedOneWithoutHotelInput;
    menu?: Prisma.MenuCreateNestedOneWithoutHotelInput;
    address?: Prisma.AddressCreateNestedOneWithoutHotelInput;
    products?: Prisma.CoffeeProductCreateNestedManyWithoutHotelInput;
    hotel_id: any;
    
}
