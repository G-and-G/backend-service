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
        return this.prisma.hotel.findMany as unknown as Hotel[];
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
        return this.prisma.hotel.create as unknown as Hotel;({
            data,
        })
    }
    async updateHotel(hotel_id:string,data:Hotel):Promise<Hotel>{
        return this.prisma.hotel.update as unknown as Hotel;({
            where:{
                hotel_id:Number(hotel_id)
            },
            data
        })
    }
    async deleteHotel(hotel_id:string):Promise<Hotel>{
        return  this.prisma.hotel.delete as unknown as Hotel;( {
            where:{hotel_id:Number(hotel_id)}
        })
    }

}