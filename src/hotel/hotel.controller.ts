import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateHotelDTO } from './dto/create-hotel.dto';
import { UpdateHotelDTO } from './dto/update-hotel.dto';

@ApiTags('hotels')
@Controller('hotels')

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

  @Get('all_hotels')
  async findAll() {
    return this.hotelService.getAllHotels();
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
