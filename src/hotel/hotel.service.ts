import { PrismaService } from "prisma/prisma.service";
import { Hotel } from "./hotel.model";
import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class HotelService{
    getHotel(id: number): Hotel | PromiseLike<Hotel> {
        throw new Error("Method not implemented.");
    }
    getHotelById(id: number): Hotel | PromiseLike<Hotel> {
        throw new Error("Method not implemented.");
    }
    constructor(private prisma: PrismaService) {

    }
    async getAllHotels():Promise<Hotel[]>{
        return this.prisma.hotel.findMany();
    }
    async createHotel(data:Hotel):Promise<Hotel>{
        const existingHotel = await this.prisma.hotel.findUnique({
            where:{
                hotel_id:data.hotel_id
            }
        })
        if(existingHotel){
            throw new ConflictException('Hotel already exists')
        }
        return this.prisma.hotel.create({
            data,
        });
    }
    async updateHotel(hotel_id:string,data:Hotel):Promise<Hotel>{
        return this.prisma.hotel.update({
            where:{
                hotel_id:Number(hotel_id)
            },
            data
        })
    }
    async deleteHotel(hotel_id:string):Promise<Hotel>{
        return return this.prisma.hotel.delete({
            where:{hotel_id:Number(hotel_id)}
        })
    }

}