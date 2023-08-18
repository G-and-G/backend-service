import { Controller, Get, Post, Put, Delete, Param, Body, UseFilters } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateHotelDTO } from './dto/create-hotel.dto';
import { Menu } from '@prisma/client';
import { CreateMenuDTO } from './dto/create-menu.dto';
import { AppExceptionFilter } from 'src/utils/filters/AppExceptionFilter';
// import { UpdateHotelDTO } from './dto/update-hotel.dto';

@ApiTags('hotels')
@Controller('hotels')
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

  @Get()
  async findAll() {
    return this.hotelService.getAllHotels();
  }

  @Post('/addMenu/:hotelId')
  async addMenu(@Body() body:CreateMenuDTO, @Param('hotelId') hotelId:number){
    return this.hotelService.addMenu(body,hotelId);
  }
  @Delete('/:hotelId')
  async deleteMenu(@Param('hotelId') hotelId:number){
    return this.hotelService.deleteMenu(hotelId);
  }
  @Put('update_hotel/:id')
  async update(@Param('id') id: number, @Body() updateHotelDTO: CreateHotelDTO) {
    return this.hotelService.updateHotel(id, updateHotelDTO);
  }

  @Delete('delete_hotel/:id')
  async remove(@Param('id') id: number) {
    return this.hotelService.deleteHotel(id);
  }

  
}
