import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Hotel } from '@prisma/client';
import { AppExceptionFilter } from 'src/utils/filters/AppExceptionFilter';
import { CreateHotelDTO } from './dto/create-hotel.dto';
import { CreateMenuDTO } from './dto/create-menu.dto';
import { HotelService } from './hotel.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role, RolesGuard } from 'src/common/guards/role.guard';
import { AdminGuard } from '../user/guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
// import { UpdateHotelDTO } from './dto/update-hotel.dto';

@Controller('hotels')
@ApiTags('hotels')
@UseGuards(RolesGuard)
@UseFilters(AppExceptionFilter)
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post('/new_hotel')
  @Roles(Role.SUPER_ADMIN)
  async create(@Body() createHotelDTO: CreateHotelDTO) {
    return this.hotelService.createHotel(createHotelDTO);
  }

  @Get('hotel/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
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
    status: 200,
    description: 'Hotels returned successfully',
  })
  @ApiOperation({
    summary: 'Get all registered hotels',
  })
  async findAll() {
    return this.hotelService.getAllHotels();
  }

  @Post('/addMenu/:hotelId')
  @ApiBody({
    type: CreateMenuDTO,
  })
  @ApiOperation({
    summary: 'Add a menu to a hotel',
  })
  async addMenu(
    @Body() body: CreateMenuDTO,
    @Param('hotelId') hotelId: number,
  ) {
    return this.hotelService.addMenu(body, hotelId);
  }

  @Delete('/:hotelId')
  @ApiParam({
    name: 'hotel id',
    description: 'The id of the hotel to be deleted',
    required: true,
  })
  async deleteMenu(@Param('hotelId') hotelId: number) {
    return this.hotelService.deleteMenu(hotelId);
  }

  @Put('update_hotel/:id')
  @ApiBody({
    type: CreateHotelDTO,
  })
  async update(
    @Param('id') id: number,
    @Body() updateHotelDTO: CreateHotelDTO,
  ) {
    return this.hotelService.updateHotel(id, updateHotelDTO);
  }

  @Delete('delete_hotel/:id')
  async remove(@Param('id') id: number) {
    return this.hotelService.deleteHotel(id);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post(':userId/hotels/:hotelId/admin')
  async createHotelAdmin(
    @Param('userId') userId: string,
    @Param('hotelId') hotelId: number,
  ) {
    return this.hotelService.createHotelAdmin(userId, Number(hotelId));
  }

}