import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import ApiResponse from 'src/utils/ApiResponse';
import { CreateMenuItemDTO } from './dtos/createMenuItemDTO';
import { MenuService } from './menu.service';
const prisma = new PrismaClient();

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('/')
  async getMenu() {
    try {
      const menus = await prisma.menu.findMany({
        include: {
          items: {
            include: {
              sub_category: true,
            },
          }, // Include items
        },
      });
      // console.log(menus[0].items)
      return ApiResponse.success('Menus here', menus, 200);
    } catch (error) {
      console.log(error);
      return ApiResponse.error(error.message, null, error.status);
    }
  }

  @Get('/:id')
  async getMenuById(@Param('id') id: number) {
    try {
      const menu = await prisma.menu.findFirst({
        where: {
          id: Number(id),
        },
        include: {
          items: {
            include: {
              sub_category: true,
            },
          },
        },
      });
      if (!menu) {
        return ApiResponse.error('Menu not found', null, 404);
      }
      return ApiResponse.success('Menu here', menu, 200);
    } catch (error) {
      console.log(error);
      return ApiResponse.error(
        'Something Went Wrong! ' + error.message,
        null,
        error.status,
      );
    }
  }

  @Delete('/:id')
  async deleteMenu(@Param('id') id: number) {
    try {
      await prisma.menu.delete({
        where: {
          id: Number(id),
        },
      });
      return ApiResponse.success('Deleted successfully', null, 200);
    } catch (error) {
      console.log(error);
      return ApiResponse.error(
        'Deleted Failure ' + error.message,
        null,
        error.status,
      );
    }
  }
  //  @Post("/new")
  //  as
  @Get('/menuItem/:id')
  @ApiParam({
    name: 'id',
  })
  async getMenuitem(@Param('id') id) {
    try {
      const menuItem = await prisma.menuItem.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!menuItem) {
        throw new Error('Menu Item not found');
      }
      return ApiResponse.success('Menu Item got!', menuItem, 200);
    } catch (error) {
      console.log(error);
      return ApiResponse.error("Can't find menuItem", null, error.status);
    }
  }

  @Post('/menuItem/new')
  // @UseGuards(AdminGuard)
  async createNewMenuItem(@Body() body: CreateMenuItemDTO, @Req() req: any) {
    return this.menuService.addMenuItem(body, req.user);
  }

  @Get('/byHotel/:id')
  @ApiParam({
    name: 'id',
  })
  async getMenuByHotelId(@Param('id') id: number) {
    return this.menuService.getMenuByHotelId(id, true);
  }
}
