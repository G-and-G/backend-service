import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
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
      return res.send(
        buildResponse("Provide all the required details", Status.FAILED, null)
      );
    }

    const newMenu = await prisma.menu.create({
      data: {
        categories,
        hotel_id,
        items,
      },
    });

    return res.send(
      buildResponse("Menu created", Status.SUCCESS, newMenu)
    );
  } catch (error) {
    console.log(error);
    return res.send(
      buildResponse("Something went wrong!", Status.FAILED, null)
    );
  }
}

@Post('/menuItem')
async createNewMenuItem(@Req() req:Request, @Res() res:Response, @Body() body){
 try {
    let {menu_id,category_id} = body;
    const newItem = await prisma.menuItem.create({
        data:{
            ...body,
            category:{
                connect:{category_id}
            },
            menu:{
                connect:{menu_id}
            }
        }
    })
    return res.send(buildResponse("MenuItem created",Status.SUCCESS,newItem))
 } catch (error) {
    console.log(error)
    return res.send(buildResponse("MenuItem couldn't be created!",Status.FAILED,null));
 }
}

}    
