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
import { Category, MenuItem, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import ApiResponse from 'src/utils/ApiResponse';
import { Status, buildResponse } from 'src/utils/responseBuilder';
import { CreateMenuItemDTO } from './dtos/createMenuItemDTO';
import { ApiParam } from '@nestjs/swagger';
const prisma = new PrismaClient();
@Controller('menu')
export class MenuController {
  @Get('/')
  async getMenu() {
    try {
      let menus = await prisma.menu.findMany({
        include: {
          categories: true, // Include categories
          items: true, // Include items
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
      let menu = await prisma.menu.findFirst({
        where: {
          menu_id: Number(id),
        },
        include: {
          items: true,
          categories: true,
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
          menu_id: Number(id),
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
  //         menuItem_id:{
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
  //         menu_id:newMenu.menu_id
  //       },
  //       data:{
  //         categories:{
  //           connect: categoriesRecords.map(category => ({category_id:category.category_id}))
  //         },
  //         items:{
  //           connect: itemsRecords.map(item => ({menuItem_id:item.menuItem_id}))
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
  async getMenuitem(@Param('id') menuItem_id) {
    try {
      let menuItem = await prisma.menuItem.findUnique({
        where: {
          menuItem_id: Number(menuItem_id),
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
    @Param('menuId') menu_id: number,
    @Param('categoryId') category_id: number,
  ) {
    try {
      let category = await prisma.category.findFirst({
        where: {
          category_id: Number(category_id),
        },
      });
      let menu = await prisma.menu.findFirst({
        where: {
          menu_id: Number(menu_id),
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

      if (!category.menu_id) {
        await prisma.category.update({
          where: {
            category_id: Number(category_id),
          },
          data: {
            menu:{
              connect:{
                menu_id:Number(menu_id)
              }
            }
          },
        });
      }

      const newItem = await prisma.menuItem.create({
        data: {
          ...body,
          category: {
            connect: {
              category_id: Number(category_id),
            },
          },
          Menu: {
            connect: {
              menu_id: Number(menu_id),
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
