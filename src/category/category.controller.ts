import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseFormat } from 'src/utils/responseBuilder';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { Status, buildResponse } from 'src/utils/responseBuilder';
import { CreateCategoryDto } from './dto/category.dto';
import { ErrorInterceptor } from 'src/interceptors/ErrorHandling.interceptor';
// import { ErrorInterceptor } from 'src/interceptors/ErrorHandling.interceptor';

const prisma = new PrismaClient();
@Controller('category')
@ApiTags('categories')
@UseInterceptors(ErrorInterceptor)
export class CategoryController {
  @ApiResponse({
    status: 200,
    description: 'Categories returned successfully',
  })
  @Get('/')
  async getCategories(@Req() req: Request, @Res() res: Response) {
    try {
      const categories = await prisma.category.findMany();
      // console.log(categories);
      return res.send(buildResponse('Categories', Status.SUCCESS, categories));
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/new')
  @ApiResponse({
    status: 201,
    description: 'The request was successful',
    // Replace with the actual DTO class for the response
  })
  @ApiOperation({ summary: 'Create a new category' })
  async createCategory(
    @Res() res: Response,
    @Body() body: CreateCategoryDto,
  ) {
    let { description, name, type, image } = body;
    if (!description || !name || !type || !image) {
      return res.send(
        buildResponse('Provide all the required details', Status.FAILED),
      );
    }
    const newCategory = await prisma.category.create({
      data: {
        description,
        name,
        image,
        type:type.toLowerCase() == 'food' ? "FOOD":"DRINK",
      },
    });
    return res
      .status(201)
      .send(buildResponse('Category created!', Status.SUCCESS, newCategory));
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of the category to be updated',
    required: true,
  })
  @ApiOperation({ summary: 'Update an already existing category' })
  async updateCategory(
    @Param('id') id,
    @Res() res: Response,
    @Body() body: CreateCategoryDto,
  ) {
    let category = await prisma.category.update({
      data: {
        ...body,
        type:body.type.toLowerCase() == 'food' ? "FOOD":"DRINK",
      },
      where: {
        category_id: parseInt(id),
      },
    });
    if (category) {
      return res.send(
        buildResponse('Category updated!', Status.SUCCESS, category),
      );
    }
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of the category to be deleted',
    required: true,
  })
  @ApiBody({
    description: '',
  })
  @ApiOperation({ summary: 'Delete a category' })
  async deleteUpdate(@Param('id') id, @Res() res: Response) {
    const cat = await prisma.category.delete({
      where: {
        category_id: parseInt(id),
      },
    });
    if (cat) {
      return res.send(buildResponse('Category deleted!', Status.SUCCESS, cat));
    } else {
      throw new Error('Category not found!');
    }
  }
}
