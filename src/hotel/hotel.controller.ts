import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { HotelService } from "./hotel.service";
import { Request,Response } from "express";
// import { Hotel } from "@prisma/client";
import { Hotel } from "./hotel.model";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
@Controller('hotel')
export class HotelController{
    constructor(private readonly hotelService: HotelService) {}
    @Get()
    @ApiOperation({summary: 'Get all data from this api'})
    @ApiResponse({
        status: 200,
        description: 'All Data list', schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    hotel_id: {
                        type: 'integer',
                        description: 'this is unique id',
                        example: '100'
                    },
                    name: {
                        type: 'string',
                        description: 'this is the name',
                        example: 'Test'
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 403,
        description: 'Fobidden'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error'
    })
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
    @ApiOperation({ summary: 'create new record'})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                hotel_id: {
                    type: 'integer',
                    example: 5,
                    description: 'this is unique id',
                },
                name: {
                    type: 'string',
                    example: 'test',
                    description: 'this is the name'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'saved...'
    })
    @ApiResponse({
        status: 403,
        description: 'Fobidden'
    })
    async postHotel(@Body() postData:Hotel):Promise<Hotel>{
        return this.hotelService.createHotel(postData);
    }

    @Get('/:hotel_id')
    @ApiOperation({summary: 'Get all data from this api'})
    @ApiResponse({
        status: 200,
        description: 'All Data list', schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    hotel_id: {
                        type: 'integer',
                        description: 'this is unique id',
                        example: '100'
                    },
                    name: {
                        type: 'string',
                        description: 'this is the name',
                        example: 'Test'
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 403,
        description: 'Fobidden'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error'
    })
    async getHotel(@Param('hotel_id') hotel_id:number):Promise<Hotel|null>{
        return this.hotelService.getHotel(hotel_id);
    }
    
    @Delete('/delete/:hotel_id')
    @ApiOperation({summary: 'delete the record'})
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'enter unique id',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'deleted the record'
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden'
    })
    async deleteHotel(@Param('hotel_id') hotel_id:string):Promise<Hotel>{
        return this.hotelService.deleteHotel(hotel_id);
    }

    @Put('/update/:hotel_id')
    @ApiOperation({summary: 'update the record'})
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'enter unique id',
        required: true
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                    example: 5,
                    description: 'this is unique id',
                },
                name: {
                    type: 'string',
                    example: 'test',
                    description: 'this is the name'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'updated successfully'
    })
    @ApiResponse({
        status: 403,
        description: 'Fobidden'
    })
    async updateHotel(@Param('hotel_id') hotel_id:string,@Body() postData:Hotel):Promise<Hotel>{
        return this.hotelService.updateHotel(hotel_id,postData);
    }
}