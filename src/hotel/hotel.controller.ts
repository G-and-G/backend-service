import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { HotelService } from "./hotel.service";
import { Request,Response } from "express";
// import { Hotel } from "@prisma/client";
import { Hotel } from "./hotel.model";
@Controller('hotel')
export class HotelController{
    constructor(private readonly hotelService: HotelService) {}
    @Get()
    async getAllHotels(@Req() request:Request,@Res() response:Response):Promise<any>{
        try {
            const result = await this.hotelService.getAllHotels();
            return response.status(200).json({
                status:'ok!',
                message:'successfully fetch data',
                result:result
            })
        } catch (error) {
            return response.status(500).json({
                status:'error',
                message:'Internal server error',
            })
        }
    }
    @Post('/new')
    async postHotel(@Body() postData:Hotel):Promise<Hotel>{
        return this.hotelService.createHotel(postData);
    }
    @Get('/:hotel_id')
    async getHotel(@Param('hotel_id') hotel_id:number):Promise<Hotel|null>{
        return this.hotelService.getHotel(hotel_id);
    }
    @Delete('/delete/:hotel_id')
    async deleteHotel(@Param('hotel_id') hotel_id:string):Promise<Hotel>{
        return this.hotelService.deleteHotel(hotel_id);
    }
    @Put('/update/:hotel_id')
    async updateHotel(@Param('hotel_id') hotel_id:string,@Body() postData:Hotel):Promise<Hotel>{
        return this.hotelService.updateHotel(hotel_id,postData);
    }
}