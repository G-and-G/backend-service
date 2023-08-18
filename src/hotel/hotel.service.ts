import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import { PrismaService } from 'path-to-your-prisma-service';
// Import your Prisma service or use your preferred data access method
// import { CreateHotelDTO } from './dto/create-hotel.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateHotelDTO } from './dto/create-hotel.dto';
// import { CreateHotelDTO } from './dto/update-hotel.dto';
import { Category, Hotel } from '@prisma/client';
// import { Hotel } from './hotel.entity';
import ApiResponse from 'src/utils/ApiResponse';
import { CreateMenuDTO } from './dto/create-menu.dto';
@Injectable()
export class HotelService {
  constructor(private readonly prisma: PrismaService) {}

  async createHotel(createHotelDTO: CreateHotelDTO): Promise<Hotel> {
    console.log('Received DTO:', createHotelDTO);
    try {
      if (!createHotelDTO || !createHotelDTO.address) {
        throw new BadRequestException('Invalid input data');
      }
      const adminUser = await this.prisma.users.findUnique({
        where: { id: createHotelDTO.admin_id },
      });
      // console.log(adminUser);

      if (!adminUser) {
        throw new NotFoundException('Admin user not found');
      }
      const hotel = await this.prisma.hotel.create({
        data: {
          name: createHotelDTO.name,
          image: createHotelDTO.image,
          address: {
            create: {
              latitude: createHotelDTO.address.latitude,
              longitude: createHotelDTO.address.longitude,
              street: createHotelDTO.address.street,
              district: createHotelDTO.address.district,
              sector: createHotelDTO.address.sector,
              cell: createHotelDTO.address.cell,
              village: createHotelDTO.address.village,
            },
          },
          admin_id: createHotelDTO.admin_id,
        },
      });
      console.log('This is the hotel: ', hotel);

      return hotel;
    } catch (error) {
      console.log(error);

      // Handle specific errors, e.g., duplicate entries
      if (error.code === 'P2002') {
        const key = error.meta.target[0];
        throw new ConflictException(
          `${key.charAt(0).toUpperCase() + key.slice(1)} already exists`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException('Internal server error', error);
    }
  }

  async getHotelById(id: number): Promise<Hotel> {
    const hotel = await this.prisma.hotel.findUnique({
      where: { hotel_id: id },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    return hotel;
  }

  async getAllHotels(): Promise<Hotel[]> {
    return this.prisma.hotel.findMany();
  }

  async updateHotel(
    id: number,
    updateHotelDTO: CreateHotelDTO,
  ): Promise<Hotel> {
    const existingHotel = await this.prisma.hotel.findUnique({
      where: { hotel_id: id },
    });

    if (!existingHotel) {
      throw new NotFoundException('Hotel not found');
    }

    try {
      const adminUser = await this.prisma.users.findUnique({
        where: { id: updateHotelDTO.admin_id },
      });

      if (!adminUser) {
        throw new NotFoundException('Admin user not found');
      }

      const updatedHotel = await this.prisma.hotel.update({
        where: { hotel_id: id },
        data: {
          name: updateHotelDTO.name,
          image: updateHotelDTO.image,
          address: {
            update: {
              latitude: updateHotelDTO.address.latitude,
              longitude: updateHotelDTO.address.longitude,
              street: updateHotelDTO.address.street,
              district: updateHotelDTO.address.district,
              sector: updateHotelDTO.address.sector,
              cell: updateHotelDTO.address.cell,
              village: updateHotelDTO.address.village,
            },
          },
          admin_id: updateHotelDTO.admin_id,
        },
      });

      return updatedHotel;
    } catch (error) {}
  }
  async deleteHotel(id: number): Promise<void> {
    const existingHotel = await this.prisma.hotel.findUnique({
      where: { hotel_id: Number(id) },
    });
    if (!existingHotel) {
      throw new NotFoundException('Hotel not found');
    }
    await this.prisma.hotel.delete({ where: { hotel_id: Number(id) } });
  }

  async addMenu(data: CreateMenuDTO, hotelId: number) {
    try {
      const hotel = await this.prisma.hotel.findUnique({
        where: {
          hotel_id: Number(hotelId),
        },
      });
      if (!hotel) {
        throw new NotFoundException('Hotel not found!');
      }
      let newItem;
      var newItems = [];
      var { items, categories } = data;
      var newCategories = [];
      for (var item of items) {
        const { category_id, ...itemData } = item;
        newItem = await this.prisma.menuItem.create({
          data: {
            ...itemData,
            category: { connect: { category_id: category_id } },
          },
        });
        newItems.push(newItem);
      }
      for (var cat of categories) {
        let category = await this.prisma.category.findUnique({
          where: {
            category_id: cat as number,
          },
        });
        if (!category) {
          throw new NotFoundException('Category not found!');
        }
        newCategories.push(category);
      }
      const categoryConnections = newCategories.map((category) => ({
        category_id: category.category_id,
      }));
      console.log('connections', ...categoryConnections);
      const itemsConnections = newItems.map((item) => ({
        menuItem_id: item.menuItem_id,
      }));
      const newMenu = await this.prisma.menu.create({
        data: {
          categories: {
            connect: [...(categoryConnections as any[])],
          },
          items: {
            connect: [...(itemsConnections as any[])],
          },
        },
      });
      
      await this.prisma.hotel.update({
        where:{
          hotel_id:hotel.hotel_id
        },
        data:{
          menu:{
            connect:{
              menu_id:newMenu.menu_id
            }
          }
        }

      })
      
      return ApiResponse.success('Menu created Successfully!', newMenu, 201);
    } catch (error) {
      console.log(error);
      return ApiResponse.error(
        'Menu creation failure! ' + error.message,
        null,
        error.status,
      );
    }
  }

  async deleteMenu(hotelId: number) {
    try {
      let hotel = await this.prisma.hotel.findFirst({
        where: {
          hotel_id: Number(hotelId),
        },
      });
      console.log(hotel);
      if (!hotel) {
        throw new Error('Hotel not found!');
      }
      if(!hotel.menu_id){
        throw new Error("Hotel doesn't have a menu")
      }
      let menuId = hotel.menu_id;
      await this.prisma.hotel.update({
        where: {
          hotel_id: hotel.hotel_id,
        },
        data: {
          menu: {
            disconnect: true,
          },
        },
      });
      console.log('MenuId', menuId)
      await this.prisma.menu.delete({
        where: {
          menu_id: menuId,
        },
      });
      return ApiResponse.success(
        'Deleted and disconnected successfully',
        hotel,
        200,
      );
    } catch (error) {
      if(error.message.includes('Record to delete does not exist')){
        return ApiResponse.error('Record to delete does not exist', null, error.status);
      }
      return ApiResponse.error('Record to delete does not exist', null, error.status);
    }
  }
}
