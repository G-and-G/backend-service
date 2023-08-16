import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'path-to-your-prisma-service';
 // Import your Prisma service or use your preferred data access method
// import { CreateHotelDTO } from './dto/create-hotel.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateHotelDTO } from './dto/create-hotel.dto';
import { UpdateHotelDTO } from './dto/update-hotel.dto';
import { Hotel } from '@prisma/client';
// import { Hotel } from './hotel.entity';
import ApiResponse from 'src/utils/ApiResponse';
@Injectable()
export class HotelService {
  constructor(private readonly prisma: PrismaService) {}

  async createHotel(createHotelDTO: CreateHotelDTO): Promise<Hotel> {
    try {
        const hotel = await this.prisma.hotel.create({
            data: {
                name: createHotelDTO.name,
                image: createHotelDTO.image,
               
            }
        })
        return  hotel;
    } catch (error) {
        // Handle specific errors, e.g., duplicate entries
        if (error.code === 'P2002') {
          const key = error.meta.target[0];
          throw new ConflictException(`${key.charAt(0).toUpperCase() + key.slice(1)} already exists`);
      }
      throw new InternalServerErrorException('Internal server error');
    }
}

  async getHotelById(id: number): Promise<Hotel> {
    const hotel = await this.prisma.hotel.findUnique({ where: { hotel_id: id } });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    return hotel;
  }

  async getAllHotels(): Promise<Hotel[]> {
    return this.prisma.hotel.findMany();
  }

  async updateHotel(id: number, updateHotelDTO: UpdateHotelDTO): Promise<Hotel> {
    const existingHotel = await this.prisma.hotel.findUnique({ where: { hotel_id: id } });
    if (!existingHotel) {
      throw new NotFoundException('Hotel not found');
    }
    return this.prisma.hotel.update({ where: { hotel_id: id }, data: updateHotelDTO });
  }

  async deleteHotel(id: number): Promise<void> {
    const existingHotel = await this.prisma.hotel.findUnique({ where: { hotel_id: id } });
    if (!existingHotel) {
      throw new NotFoundException('Hotel not found');
    }
    await this.prisma.hotel.delete({ where: { hotel_id: id } });
  }
}
