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
