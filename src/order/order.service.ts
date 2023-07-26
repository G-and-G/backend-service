import { Injectable } from '@nestjs/common';
import { Address, Order } from '@prisma/client';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
@Injectable()
export class OrderService {
   async getOrders():Promise<Address[]>{
        const user = await prisma.address.create({
            data:{
                village:"Rwampara",
                cell:"Mumena",
                sector:"Rwankeri",
                district:"Nyarugenge",
                latitude:10.4,
                longitude:30.45,
                street:"KN 45 ST",
                hotel_id:"hotel1"
            }
        }).then(_ =>{
            console.log("Order created successfully")
        })
        return await prisma.address.findMany();
    }
}
