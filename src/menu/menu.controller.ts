import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { Category, Hotel, MenuItem, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { Status, buildResponse } from 'src/utils/responseBuilder';
const prisma = new PrismaClient();
@Controller('menu')
export class MenuController {
    @Get('/')
    getMenu(){
       
    }

    @Post('/new')
async createMenu(@Req() req: Request, @Res() res: Response, @Body() body) {
  try {
    const { categories, items, hotel_id } = body;
    if (!hotel_id || items.length <= 0 || categories.length <= 0) {
      throw new Error("Provide the required details")
    }
  
    const newMenu = await prisma.menu.create({
      data: {
        hotel_id,
      },
    });
    const itemsRecords = await prisma.menuItem.findMany({
      where:{
        menuItem_id:{
          in: items
        }
      }
    });

    const categoriesRecords = await prisma.category.findMany({
      where:{
        category_id:{
in: categories
        }
      }
    })
    await prisma.menu.update({
      where:{
        menu_id:newMenu.menu_id
      },
      data:{
        categories:{
          connect: categoriesRecords.map(category => ({category_id:category.category_id}))
        },
        items:{
          connect: itemsRecords.map(item => ({menuItem_id:item.menuItem_id}))
        }
      }
    })
    return res.send(
      buildResponse("Menu created", Status.SUCCESS, newMenu)
    );
  } catch (error) {
    console.log(error);
    return res.send(
      buildResponse("Something went wrong!"+ ` ${error.message}`, Status.FAILED, null)
    );
  }

}

@Post('/menuItem/new')
async createNewMenuItem(@Req() req:Request, @Res() res:Response, @Body() body){
 try {
    let {menu_id,category_id} = body;
    let category = await prisma.category.findFirst({
      where:{
        category_id
      }
    });
    if(!category){
      throw new Error("Category doesn't exist")
    }
    const newItem = await prisma.menuItem.create({
        data:{
            ...body,
        }
    })
    return res.send(buildResponse("MenuItem created",Status.SUCCESS,newItem))
 } catch (error) {
    console.log(error.message)
    return res.send(buildResponse("MenuItem couldn't be created!" + ` ${error.message}`,Status.FAILED,null));
 }
}

}    
