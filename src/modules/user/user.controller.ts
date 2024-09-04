import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import ApiResponse from 'src/utils/ApiResponse';
import { RegisterDTO } from './dto/create-user.dto';
import { AdminGuard } from './guards/admin.guard';
import { UserService } from './user.service';
import { Role, RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('user')
@ApiBearerAuth('JWT-auth')
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
  async update() {
    //
  }
  @Delete("/all")
  async deleteAll(){
    return this.userService.deleteAll();
  }

  @Get('all')
  async all() {
    const users = await this.userService.getAllUsers();
    return ApiResponse.success('Users retrieved successfully', users);
  }

  @Get('byId/:id')
  async get(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return ApiResponse.success('User retrieved successfully', user);
  }
  @Get('search/:query')
  async search(@Param('query') query: string) {
    const results = await this.userService.searchUsers(query);
    return ApiResponse.success(
      'Search results retrieved successfully for user',
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

  @Get('/me')
  @UseGuards(AuthGuard)
  async me(@Req() req) {
    const user = await this.userService.getUserById(req.user.id);
    return ApiResponse.success('User retrieved successfully', user);
  }

  // @Put('make-admin/:id')
  // @UseGuards(AuthGuard,RolesGuard)
  // @Roles(Role.SUPER_ADMIN)
  // async makeUserAdmin(@Param('id') userId: string,@Request() req) {
  //   console.log('[APPLICATION LOG]: Current User:', req.user);
  //   const response = await this.userService.makeUserAdmin(userId);
  //   // console.log("errorrr");

  //   return response;
  // }

  @Put('make-admin/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async makeUserAdmin(@Param('id') userId: string, @Request() req) {
    console.log('[APPLICATION LOG]: Current User:', req.user);
    const response = await this.userService.makeUserAdmin(userId);
    // console.log("errorrr");

    return response;
  }

  @Put('make-super-admin/:id')
  async makeUserSuperAdmin(@Param('id') userId: string) {
    const response = await this.userService.makeUserSuperAdmin(userId);
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
