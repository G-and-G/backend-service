import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import ApiResponse from 'src/utils/ApiResponse';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService){}

    async getSubCategories(){
        console.log("fetching....")
        try {
            const subCategories = await this.prisma.subCategory.findMany();
            console.log(subCategories)
            return ApiResponse.success("Successfully fetched subcategories!",subCategories);
        } catch (error) {
            console.log(error.message);
            return ApiResponse.error("Error fetching subcategories!",error.message);
        }
    }

    async createSubCategory(subCategoryDTO:CreateCategoryDto){
        try {
            const subCategory = await this.prisma.subCategory.create({
                data:{
                    ...subCategoryDTO
                }
            });
            return ApiResponse.success("Subcategory created successfully",subCategory);
        } catch (error) {
            return ApiResponse.error("Error creating Subcategory", error);
        }
    }

    async updateSubCategory(subCategoryDTO: CreateCategoryDto,subCategoryId:number){
        try {
            const subCategory = await this.prisma.subCategory.update({
                where:{
                   id:Number(subCategoryId)
                },
                data:{
                    ...subCategoryDTO
                }
            });
            
            return ApiResponse.success("Subcategory updated successfully",subCategory);
        } catch (error) {
            console.log(error)
            return ApiResponse.error("Error updating Subcategory", error);
        }
    }

    async deleteSubcategory(subCategoryId:number){
        try {
            await this.prisma.subCategory.delete(
                {
                    where:{
                        id:Number(subCategoryId)
                    }
                }
            );
            return ApiResponse.success("Successfully deleted subcategory");
        } catch (error) {
            return ApiResponse.error("Error deleting subcategory", error);
        }
    }
}
