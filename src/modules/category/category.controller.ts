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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { ErrorInterceptor } from 'src/interceptors/ErrorHandling.interceptor';
import { Status, buildResponse } from 'src/utils/responseBuilder';
import { CreateCategoryDto } from './dto/category.dto';
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
      const categories = await prisma.subCategory.findMany();
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
  async createCategory(@Res() res: Response, @Body() body: CreateCategoryDto) {
    const { description, name, type, image } = body;
    if (!description || !name || !type || !image) {
      return res.send(
        buildResponse('Provide all the required details', Status.FAILED),
      );
    }
    const newCategory = await prisma.subCategory.create({
      data: {
        description,
        name,
        image,
        type: type.toLowerCase() == 'food' ? 'FOOD' : 'DRINK',
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
    const category = await prisma.subCategory.update({
      data: {
        ...body,
        type: body.type.toLowerCase() == 'food' ? 'FOOD' : 'DRINK',
      },
      where: {
        id: parseInt(id),
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
    const cat = await prisma.subCategory.delete({
      where: {
        id: parseInt(id),
      },
    });
    if (cat) {
      return res.send(buildResponse('Category deleted!', Status.SUCCESS, cat));
    } else {
      throw new Error('Category not found!');
    }
  }

  // @Post('/secret')
  // async createSecretFile(@Res() res){
  //   try {
  //     let newSecret = await prisma.secret.create({
  //     data:{
  //       data:{
  //         "type": "service_account",
  //         "project_id": "grabngo-a3844",
  //         "private_key_id": "c4b08dfd023fea4dbc09c0a4605fb136079d6975",
  //         "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCw/Exo8rkt1qRQ\nKjVTIPqUXD5WX7KEmfKdkBMyLt2F9XaCwCA6HLY7Y0RZDSwqzdug59pYyviB2OPd\nE6h03P2tggZMm2218x/U6mgGDokDua5CXfmn6erRXAq4k2COI17/HVndqaCHWq5J\n6pV1AqTxIrIRhQLA1T2CgYam/OCRRfXG/Vxmw/Lnj6c/WYVU3KmLhl1Tr/yjzIXC\nje9ASn2bdnJBcJp9AzxM2diqfOzdQaevS2yBmtNFZTHz3Bzqgxh65P+VeuwbACi/\nytm3jYh/bAG4+0NQz4S3Z4lCj3+BLFB+tWW1QQJwDcIVhrusdYQCJ/tAoW5M3Kw0\n6hBP2B+XAgMBAAECggEAQjMk246KoHAsRsX66yynPc4hDQq/ieTRgIkO/RLVjlFJ\nsk9t3n611RHk01BfiGU2tQF0RQkqmdsIJD3BoXC1vGwpsgbjKw8VBX1mSnmuW0Pd\nP/rJsrqGuCeu5OpPT+tAEbmnTwevQWG0VnaVz84c5ws8wtvXM0yvtLyBIr3su7lp\nYcsHD2IBP+wUid74flUoiqQ10wGzlvJAwUji0cbJaKNT57f2vhdPDO+rhQbmwiYZ\nCUeTID478Qa44ieKRg609hItypcFzLNr4zq9oCDxawLBnp2WwIpnQ5FRqEEEmMhJ\n/dHPhBl2/dIrohVR9FG78z02BukuOZyOmLK3/ZGVZQKBgQDg8l+eORM7vxEFdi50\nRY+JbOgcgQS3hVMPMg8SAqKiBjo3Syy9g+KhNfViktJuRe15S49D+CrQ2PwtZ4kf\nS3Dk2+drTXjeJVaoHpD+ipphJCAbaUqH0BktkMIcnVI295ZEljajhCH+KxI6uukT\nszH1b34kQRlEhQ3n0VLf610ekwKBgQDJavk0yHqmRbIYurxP+3UigLQbJDmhi5ZA\nxV+UmJgc1pYlYsLZFR1bQ1om1N84KAFsBC784YBh7I6tToWgHJlPiGvYb6mzZhtz\n6eDQQjDMsxCTV1kpgqcweYssSc/1wuT+k4aibK3Xrdtf4DzGIdwmiFVZ8yDeKyKu\nd03ZectZbQKBgEA2b/0mpcrkW+OHPPOL99Fu+UNJwSLyOCeaTpsBjZNa27t1BiyD\nPWpvkMC20MMRyxxY6Wipqu87QaFkcMwyKOPrsj/7OYmQdxA+yX0f67nXKiMpB1GF\noepT7FVmw1VVj9u8VZSP33RCr018lZQ+DwDU9tk6jA/3O2T1aAbrlQVpAoGAX8pA\nOpodunXq/VfRtzgfvQj4nu/beLip/KPhkQoBTbXAMoeFozgnff/KIC2c+1gLVROo\nRRv5spiOQl3Vrw/q2ahHoed5DZjB9Z6FDIZuLuv6NhiUjulUGfmz9pwkCv1laq0+\nmoCVLL3CVxaN0KzJxomQDfdS6lYZaF/U5ljGHQECgYBpZLSLRCMbWEs9gS7H0g/e\nNvjO5VKq/b66O/INWmO6wV1CgFYJRJsW756h0oD+NyB9A2E42IS3lHQ55Rv/IZq+\nBooJBmxUJX6QmXc7l3pRA/+kpk+vKLJATIBYRrrhHO1FFo+POVuL5TPQWtTYSBIZ\n03OHhnEst4ji2o3jWO9teg==\n-----END PRIVATE KEY-----\n",
  //         "client_email": "firebase-adminsdk-ftno0@grabngo-a3844.iam.gserviceaccount.com",
  //         "client_id": "115992035682523634118",
  //         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  //         "token_uri": "https://oauth2.googleapis.com/token",
  //         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  //         "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ftno0%40grabngo-a3844.iam.gserviceaccount.com",
  //         "universe_domain": "googleapis.com"
  //       }
  //     }
  //     });
  //     return res.send(buildResponse('succes',Status.SUCCESS,newSecret))
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
