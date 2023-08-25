import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import ApiResponse from 'src/utils/ApiResponse';
import { RegisterDTO } from './dto/create-user.dto';
import { AdminGuard } from './guards/admin.guard';
import { UserService } from './user.service';
import { log } from 'console';
import { request } from 'express';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() dto: RegisterDTO) {
    const response = await this.userService.createUser(dto);
    return response;
  }

  @Put('update')
  @UseGuards(AuthGuard)
  async update() {}

  @Get('all')
  async all() {
    const users = await this.userService.getAllUsers();
    return ApiResponse.success('Users retrieved successfully', users);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);

    return ApiResponse.success('User retrieved successfully', user);
  }
  @Get('search/:query')
  async search(@Param('query') query: string) {
    const results = await this.userService.searchUsers(query);
    return ApiResponse.success(
      'Search results retrieved successfully',
      results,
    );
  }

  @Delete('delete/:id')
  @UseGuards(AdminGuard)
  async deleteUserByAdmin(@Param('id') userId: string) {
    const deletedUser = await this.userService.deleteUserById(userId);
    return ApiResponse.success('User deleted by admin', deletedUser);
  }
  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);

    // Get the authenticated user's ID from the request context
    const loggedInUserId = user.id; // Replace with actual method of getting user ID
    const deletedUser = await this.userService.deleteUserById(loggedInUserId);
    return ApiResponse.success('User deleted successfully', deletedUser);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me() {}
  @Put('make-admin/:id')
  // @UseGuards(AdminGuard)
  async makeUserAdmin(@Param('id') userId: string) {
    const response = await this.userService.makeUserAdmin(userId);
    // console.log("errorrr");

    return response;
  }
  @Put('updateadmin/:id')
  async grantHotelAccessToAdmin(
    @Param('id') userId: string,
    @Query('hotelId') hotelId: number,
  ) {
    const response = await this.userService.grantHotelAccessToAdmin(
      userId,
      hotelId,
    );
    return response;
  }
}
