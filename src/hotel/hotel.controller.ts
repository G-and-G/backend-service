import { Controller, Get, Post, Put, Delete, Param, Body, UseFilters, NotFoundException } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateHotelDTO } from './dto/create-hotel.dto';
import { Hotel, Menu } from '@prisma/client';
import { CreateMenuDTO } from './dto/create-menu.dto';
import { AppExceptionFilter } from 'src/utils/filters/AppExceptionFilter';
// import { UpdateHotelDTO } from './dto/update-hotel.dto';

@Controller('hotels')
@ApiTags('hotels')
@UseFilters(AppExceptionFilter)
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post('/new_hotel')
  async create(@Body() createHotelDTO: CreateHotelDTO) {
    return this.hotelService.createHotel(createHotelDTO);
  }

  @Get('hotel/:id')
  async findById(@Param('id') id: number) {
    return this.hotelService.getHotelById(id);
  }
  @Get('byAdminId/:adminId') 
  async getHotelByAdminId(@Param('adminId') adminId: string): Promise<Hotel> {
    try {
      const hotel = await this.hotelService.getHotelByAdminId(adminId);
      return hotel;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get()
  @ApiResponse({
    status:200,
    description:'Hotels returned successfully',  
  })
  @ApiOperation({
    summary:'Get all registered hotels'
  })
  async findAll() {
    return this.hotelService.getAllHotels();
  }

  @Post('/addMenu/:hotelId')
  @ApiBody({
    type:CreateMenuDTO
  })
  @ApiOperation({
    summary:'Add a menu to a hotel'
  })
  async addMenu(@Body() body:CreateMenuDTO, @Param('hotelId') hotelId:number){
    return this.hotelService.addMenu(body,hotelId);
  }

  @Delete('/:hotelId')
  @ApiParam({
    name:'hotel id',
    description:'The id of the hotel to be deleted',
    required:true
  })
  async deleteMenu(@Param('hotelId') hotelId:number){
    return this.hotelService.deleteMenu(hotelId);
  }


  @Put('update_hotel/:id')
  @ApiBody({
    type:CreateHotelDTO
  })
  async update(@Param('id') id: number, @Body() updateHotelDTO: CreateHotelDTO) {
    return this.hotelService.updateHotel(id, updateHotelDTO);
  }

  @Delete('delete_hotel/:id')
  async remove(@Param('id') id: number) {
    return this.hotelService.deleteHotel(id);
  }

  
}
