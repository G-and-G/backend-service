import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { Status, buildResponse } from 'src/utils/responseBuilder';
const prisma = new PrismaClient();
@Controller('category')
export class CategoryController {
    @Get('/')
    async getCategories(@Req() req:Request, @Res() res:Response){
      try {
        const categories = await prisma.category.findMany();
        return res.send(buildResponse("Categories",Status.SUCCESS,categories))
      } catch (error) {
        console.log(error)
        return res.send(buildResponse("Something went wrong",Status.FAILED,null)) 
      }
    }

    @Post('/new')
    async createCategory(@Req() req:Request, @Res() res:Response, @Body() body){
        try {
        let {description, name,subcategories,image } = body;
        const newCategory = await prisma.category.create({
            data:{
                description,
                name,
                image,
                subcategories
            }
        })
        return res.send(buildResponse("Category created!",Status.SUCCESS,newCategory))
        } catch (error) {
            console.log(error)
            return res.send(buildResponse("Category couldn't be created",Status.FAILED,null))
        }
    }
}
