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
import { Hotel, Role } from '@prisma/client';
// import { Hotel } from './hotel.entity';
import ApiResponse from 'src/utils/ApiResponse';
import { RegisterDTO } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { CreateMenuDTO } from './dto/create-menu.dto';
@Injectable()
export class HotelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createHotel(createHotelDTO: CreateHotelDTO): Promise<ApiResponse> {
    try {
      const hotel = await this.prisma.hotel.create({
        data: {
          name: createHotelDTO.name,
          image: createHotelDTO.image,
          address: {
            create: {
              latitude: createHotelDTO.address.latitude,
              longitude: createHotelDTO.address.longitude,
              street: createHotelDTO.address.street,
              name: createHotelDTO.address.name,
              city: createHotelDTO.address.city,
              country: createHotelDTO.address.country, // Optional
            },
          },
          startingWorkingTime: createHotelDTO.startingWorkingTime, // Fixed
          closingTime: createHotelDTO.closingTime,
          rating: createHotelDTO.rating || 0, // Handle rating
        },
        include: {
          admins: true,
        },
      });

      return ApiResponse.success('Hotel created successfully', hotel);
    } catch (error) {
      if (error.code === 'P2002') {
        const key = error.meta.target[0];
        return ApiResponse.sendError(
          `${key.charAt(0).toUpperCase() + key.slice(1)} already exists`,
          null,
          409,
        );
      }

      if (error.code === 'P2003') {
        return ApiResponse.sendError(
          'Invalid relation data provided',
          null,
          400,
        );
      }

      if (error.name === 'PrismaClientValidationError') {
        return ApiResponse.sendError(
          'Invalid input data for hotel creation',
          null,
          400,
        );
      }

      return ApiResponse.sendError('Internal server error', error, 500);
    }
  }

  async getHotelById(id: number): Promise<Hotel> {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: id },
      include: {
        menu: true,
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    return hotel;
  }

  async getHotelAdmins(hotelId: number): Promise<ApiResponse> {
    try {
      const hotel = await this.prisma.hotel.findFirst({
        where: {
          id: Number(hotelId),
        },
        include: {
          admins: true,
        },
      });
      if (!hotel) {
        throw new Error('No hotel found');
      }
      return ApiResponse.success('Successfully fetched admins', hotel.admins);
    } catch (error) {
      ApiResponse.error('Error fetching admins', error.message);
      return;
    }
  }

  async getHotelByProductId(id: number): Promise<Hotel> {
    const hotel = await this.prisma.hotel.findFirst({
      where: {
        menu: {
          is: {
            items: {
              some: {
                id: id,
              },
            },
          },
        },
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    return hotel;
  }

  async getAllHotels(): Promise<ApiResponse> {
    try {
      const hotels = await this.prisma.hotel.findMany({
        include: {
          menu: true,
          admins: true,
          address: true,
        },
      });
      console.log('hotels', hotels);

      return ApiResponse.success('Hotels fetched successfully', hotels);
    } catch (error) {
      ApiResponse.error('Error fetching hotels', error.message);
      return;
    }
  }

  async updateHotel(
    id: number,
    updateHotelDTO: CreateHotelDTO,
  ): Promise<Hotel> {
    const existingHotel = await this.prisma.hotel.findUnique({
      where: { id: id },
    });

    if (!existingHotel) {
      throw new NotFoundException('Hotel not found');
    }

    try {
      const updatedHotel = await this.prisma.hotel.update({
        where: { id: id },
        data: {
          name: updateHotelDTO.name,
          image: updateHotelDTO.image,
          address: {
            update: {
              latitude: updateHotelDTO.address.latitude,
              longitude: updateHotelDTO.address.longitude,
              street: updateHotelDTO.address.street,
            },
          },
          closingTime: updateHotelDTO.startingWorkingTime,
          startingWorkingTime: updateHotelDTO.closingTime,
        },
      });

      return updatedHotel;
    } catch (error) {}
  }
  async deleteHotel(id: number): Promise<void> {
    const existingHotel = await this.prisma.hotel.findUnique({
      where: { id: Number(id) },
    });
    if (!existingHotel) {
      throw new NotFoundException('Hotel not found');
    }
    await this.prisma.hotel.update({
      where: {
        id: Number(id),
      },
      data: {
        address: {
          // disconnect: true,
        },
      },
    });
    await this.prisma.hotel.delete({ where: { id: Number(id) } });
  }

  async addMenu(data: CreateMenuDTO, hotelId: number) {
    try {
      const hotel = await this.prisma.hotel.findUnique({
        where: {
          id: Number(hotelId),
        },
      });
      if (!hotel) {
        throw new NotFoundException('Hotel not found!');
      }
      let newItem;
      const newItems = [];
      const { items, categories } = data;
      const newCategories = [];
      for (const item of items) {
        const { category_id, ...itemData } = item;
        newItem = await this.prisma.menuItem.create({
          data: {
            ...itemData,
            category: { connect: { category_id: category_id } },
          },
        });
        newItems.push(newItem);
      }
      for (const cat of categories) {
        const category = await this.prisma.subCategory.findUnique({
          where: {
            id: cat as number,
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
          // categories: {
          //   connect: [...(categoryConnections as any[])],
          // },
          items: {
            connect: [...(itemsConnections as any[])],
          },
          hotel: {
            connect: {
              id: hotel.id,
            },
          },
        },
      });

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
      const hotel = await this.prisma.hotel.findFirst({
        where: {
          id: Number(hotelId),
        },
        include: {
          menu: true,
        },
      });
      console.log(hotel.menu);
      if (!hotel) {
        throw new Error('Hotel not found!');
      }
      if (!hotel.menu.id) {
        throw new Error("Hotel doesn't have a menu");
      }
      await this.prisma.hotel.update({
        where: {
          id: hotel.id,
        },
        data: {
          menu: {
            disconnect: true,
          },
        },
      });
      await this.prisma.menu.delete({
        where: {
          id: hotel.menu.id,
        },
      });
      return ApiResponse.success(
        'Deleted and disconnected successfully',
        hotel,
        200,
      );
    } catch (error) {
      console.log(error);
      if (error.message.includes('Record to delete does not exist')) {
        return ApiResponse.error(
          'Record to delete does not exist',
          null,
          error.status,
        );
      }
      return ApiResponse.error(
        'Record to delete does not exist',
        null,
        error.status,
      );
    }
  }
  async getHotelByAdminId(adminId: string): Promise<Hotel> {
    const hotel = await this.prisma.hotel.findFirst({
      where: { admins: { some: { id: adminId } } },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found for the provided admin ID');
    }

    return hotel;
  }
  async addHotelAdmin(registerDTO: RegisterDTO, hotelId: number) {
    console.log('APPLICATION LOG: Hotel ID =>', hotelId);
    try {
      // Check if the user exists
      const user = await this.userService.createUser(registerDTO);
      if (!user.data) {
        throw new NotFoundException("User couldn't be created");
      }

      // Update the Hotel to set the admin
      const hotel = await this.prisma.hotel.update({
        where: { id: Number(hotelId) },
        data: {
          admins: {
            connect: { id: user.data.id },
          },
        },
      });

      // Update the user role to ADMIN
      await this.prisma.user.update({
        where: { id: user.data.id },
        data: { role: Role.HOTEL_ADMIN },
      });

      return ApiResponse.success('Hotel admin created successfully', hotel);
    } catch (error) {
      console.error('Error creating hotel admin:', error);
      return ApiResponse.error('Error creating hotel admin', error);
    }
  }
  async removeHotelAdmin(hotelId: string, adminId: string) {
    try {
      const hotel = await this.prisma.hotel.findFirst({
        where: {
          id: Number(hotelId),
        },
      });
      if (!hotel) {
        throw new Error('Hotel not found!');
      }
      const hotelAdmin = await this.prisma.user.findFirst({
        where: {
          id: adminId,
        },
      });

      if (!hotelAdmin) {
        throw new Error('Hotel admin not found!');
      }
      await this.prisma.hotel.update({
        where: {
          id: Number(hotelId),
        },
        data: {
          admins: {
            disconnect: { id: adminId },
          },
        },
      });
    } catch (error) {
      return ApiResponse.error('Error deleting hotel Admin', error.message);
    }
  }
}
