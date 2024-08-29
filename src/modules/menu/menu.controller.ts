import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import ApiResponse from 'src/utils/ApiResponse';
import { Status, buildResponse } from 'src/utils/responseBuilder';
import { CreateMenuItemDTO } from './dtos/createMenuItemDTO';
const prisma = new PrismaClient();
@Controller('menu')
export class MenuController {
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
  //     @Post('/new')
  // async createMenu(@Req() req: Request, @Res() res: Response, @Body() body) {
  //   try {
  //     const { categories, items, hotel_id } = body;
  //     if (!hotel_id || items.length <= 0 || categories.length <= 0) {
  //       throw new Error("Provide the required details")
  //     }

  //     const newMenu = await prisma.menu.create({
  //       data: {
  //         hotel_id,
  //       },
  //     });
  //     const itemsRecords = await prisma.menuItem.findMany({
  //       where:{
  //         id:{
  //           in: items
  //         }
  //       }
  //     });

  //     const categoriesRecords = await prisma.category.findMany({
  //       where:{
  //         category_id:{
  // in: categories
  //         }
  //       }
  //     })
  //     await prisma.menu.update({
  //       where:{
  //         id:newMenu.id
  //       },
  //       data:{
  //         categories:{
  //           connect: categoriesRecords.map(category => ({category_id:category.category_id}))
  //         },
  //         items:{
  //           connect: itemsRecords.map(item => ({id:item.id}))
  //         }
  //       }
  //     })
  //     return res.send(
  //       buildResponse("Menu created", Status.SUCCESS, newMenu)
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return res.send(
  //       buildResponse("Something went wrong!"+ ` ${error.message}`, Status.FAILED, null)
  //     );
  //   }

  // }
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

  @Post('/menuItem/new/:menuId/:categoryId')
  async createNewMenuItem(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateMenuItemDTO,
    @Param('menuId') id: number,
    @Param('categoryId') category_id: number,
  ) {
    try {
      const category = await prisma.subCategory.findFirst({
        where: {
          id: Number(category_id),
        },
      });
      const menu = await prisma.menu.findFirst({
        where: {
          id: Number(id),
        },
        include: {
          items: true,
        },
      });
      if (!category) {
        throw new Error("Category doesn't exist");
      }
      if (!menu) {
        throw new Error("Menu doesn't exist");
      }

      // if (!category.id) {
      //   await prisma.subCategory.update({
      //     where: {
      //       id: Number(category_id),
      //     },
      //     data: {
      //       menu: {
      //         connect: {
      //           id: Number(id),
      //         },
      //       },
      //     },
      //   });
      // }

      const newItem = await prisma.menuItem.create({
        data: {
          ...body,
          sub_category: {
            connect: {
              id: Number(category_id),
            },
          },
          menu: {
            connect: {
              id: Number(id),
            },
          },
        },
      });

      return res.send(
        buildResponse('MenuItem created', Status.SUCCESS, newItem),
      );
    } catch (error) {
      console.log(error.message);
      return res.send(
        buildResponse(
          "MenuItem couldn't be created!" + ` ${error.message}`,
          Status.FAILED,
          null,
        ),
      );
    }
  }
}
