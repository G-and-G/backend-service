import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMenuDTO } from '../hotel/dto/create-menu.dto';
import { CreateMenuItemDTO } from './dtos/createMenuItemDTO';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async createMenu(data: CreateMenuDTO, hotelId: number) {
    return this.prisma.menu.create({
      data: {
        hotel_id: hotelId,
      },
    });
  }

  async getMenuByHotelId(hotelId: number, includeItems = false) {
    const menu = this.prisma.menu.findUnique({
      where: {
        hotel_id: Number(hotelId),
      },
      include: {
        items: includeItems,
      },
    });
    if (!menu) {
      throw new NotFoundException('Menu not found');
    }
    return menu;
  }

  async addMenuItem(data: CreateMenuItemDTO, reqUser?: any) {
    try {
      let hotel_id = data.hotel_id;
      if (!hotel_id) {
        hotel_id = reqUser.hotel.id;
      }
      if (!hotel_id) {
        throw new Error(
          'Hotel id not found. Please specify it if user has no hotel',
        );
      }
      let hotelMenu = await this.prisma.menu.findUnique({
        where: { hotel_id: data.hotel_id },
      });
      // create menu if not found
      if (!hotelMenu) {
        hotelMenu = await this.prisma.menu.create({
          data: {
            hotel_id: data.hotel_id,
          },
        });
      }
      return await this.prisma.menuItem.create({
        data: {
          name: data.name,
          quantity_available: data.quantity_available,
          sub_category_id: data.category_id,
          menu_id: hotelMenu.id,
          description: data.description,
          image: data.image,
          price: data.price,
        },
      });
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException(error);
    }
  }
}
