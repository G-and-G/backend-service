import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
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
        if(!description || !name || !subcategories || !image){
          return res.send(buildResponse("Provide all the required details",Status.FAILED));
        }
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

    @Put("/:id")
    async updateCategory(@Param('id') id,@Res() res:Response, @Body() body:any){
      try {
        let category = await prisma.category.update({
          data:{
            ...body,
          },
          where:{
            category_id:parseInt(id)
          }
        })
        if(category){
          return res.send(buildResponse("Category updated!",Status.SUCCESS,category))
        }
      } catch (error) {
        console.log(error)
        return res.send(buildResponse("Category couldn't be updated",Status.FAILED,null))
      }
    }

    @Delete('/:id')
    async deleteUpdate(@Param("id") id, @Res() res:Response){
      try {
        const cat = await prisma.category.delete({
          where:{
            category_id:parseInt(id)
          }
        })
        if(cat){
          return res.send(buildResponse("Category deleted!",Status.SUCCESS,cat))
        }
      } catch (error) {
        console.log(error)
        return res.send(buildResponse("Category couldn't be deleted",Status.FAILED,null))
      }
    }
}
