import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { Status, buildResponse } from 'src/utils/responseBuilder';
import { CreateCategoryDto } from './dto/category.dto';
const prisma = new PrismaClient();
@Controller('category')
@ApiTags('categories')
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
    @ApiResponse({
      status: 201,
      description: 'The request was successful',     
     // Replace with the actual DTO class for the response
    })
    async createCategory(@Req() req:Request, @Res() res:Response, @Body() body:CreateCategoryDto){
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
        return res.status(201).send(buildResponse("Category created!",Status.SUCCESS,newCategory))
        } catch (error) {
            console.log(error)
            return res.send(buildResponse("Category couldn't be created",Status.FAILED,null))
        }
    }

    @Put("/:id")
    @ApiParam({name:'id',type:Number,description:"Id of the category to be updated",required:true})
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
    @ApiParam({name:'id',type:Number,description:"Id of the category to be deleted",required:true})
    @ApiBody({
      description:""
    })
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
