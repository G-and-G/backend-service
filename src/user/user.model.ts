import { Prisma } from "@prisma/client";

export class User implements Prisma.UserCreateInput{
    user_id?: string;
    fullName: string;
    gender: string;
    email: string;
    password: string;
    username: string;
    telephone: string;
    order?: Prisma.OrderCreateNestedManyWithoutCustomerInput;
    hotel?: Prisma.HotelCreateNestedOneWithoutAdminInput;

}