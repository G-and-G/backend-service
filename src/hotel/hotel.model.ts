import { Prisma } from "@prisma/client";
import { IsString } from "class-validator";

export class Hotel{
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
    products?: Prisma.CoffeeProductCreateInput;
    hotel_id: any;
}
