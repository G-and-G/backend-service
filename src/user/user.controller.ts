import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import ApiResponse from 'src/utils/ApiResponse';
import { RegisterDTO } from './dto/create-user.dto';
import { AdminGuard } from './guards/admin.guard';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Post('register')
    @UsePipes(ValidationPipe)
    async register(@Body() dto: RegisterDTO) {
        const response = await this.userService.createUser(dto)
        return response
    }

    @Put('update')
    @UseGuards(AuthGuard)
    async update() {

    }

    @Get("all?page=:page&limit=:limit")
    async all(@Query("page") page: number, @Query("limit") limit: number) {

    }

    @Get(":id")
    async get(@Param("id") id: String) {

    }


    @Get("search/:query")
    async search(@Param("query") query: String) {

    }

    @Delete("delete/:id")
    @UseGuards(AdminGuard)
    async deleteUserByAdmin(@Param("id") userId: String) {

    }

    @Delete("delete")
    @UseGuards(AuthGuard)
    async deleteUser() {

    }

    @Get('me')
    @UseGuards(AuthGuard)
    async me() {

    }

}
