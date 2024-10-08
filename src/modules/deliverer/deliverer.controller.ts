import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/guards/role.guard';
import {
  AssignOrderDto,
  CreateDelivererDto,
  UpdateDelivererDto,
} from './deliverer.dto';
import { DelivererService } from './deliverer.service';

@ApiTags('deliverers')
@Controller('deliverers')
export class DelivererController {
  constructor(private readonly delivererService: DelivererService) {}

  @Post('/create')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Create a new deliverer for a specific hotel' })
  @ApiResponse({
    status: 201,
    description: 'The deliverer has been successfully created.',
  })
  async createDeliverer(
    @Body() createDelivererDto: CreateDelivererDto,
    @Query('hotelId') hotelId: string,
  ) {
    return this.delivererService.createDeliverer(createDelivererDto, hotelId);
  }

  @Post('/add-existing')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({
    summary: 'Add an existing user/deliverer to a specific hotel',
  })
  @ApiResponse({
    status: 201,
    description: 'The deliverer has been successfully added.',
  })
  async addExistingDeliverer(
    @Query('email') email: string,
    @Query('hotelId') hotelId: string,
  ) {
    return this.delivererService.addExistingDeliverer(email, hotelId);
  }

  @Put('update/:id')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Update a deliverer' })
  @ApiResponse({
    status: 200,
    description: 'The deliverer has been successfully updated.',
  })
  async updateDeliverer(
    @Param('id') id: string,
    @Body() updateDelivererDto: UpdateDelivererDto,
  ) {
    return this.delivererService.updateDeliverer(id, updateDelivererDto);
  }

  @Delete('delete/:id')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Delete a deliverer' })
  @ApiResponse({
    status: 200,
    description: 'The deliverer has been successfully deleted.',
  })
  async deleteDeliverer(@Param('id') id: string) {
    return this.delivererService.deleteDeliverer(id);
  }

  @Post('assign-order')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Assign an order to a deliverer' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully assigned.',
  })
  async assignOrder(@Body() assignOrderDto: AssignOrderDto) {
    return this.delivererService.assignOrder(assignOrderDto);
  }

  @Get('hotel/:hotelId')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Get all deliverers for a specific hotel' })
  @ApiResponse({
    status: 200,
    description: 'Deliverers retrieved successfully.',
  })
  async getDeliverersByHotel(@Param('hotelId') hotelId: string) {
    return this.delivererService.getDeliverersByHotel(hotelId);
  }

  @Get('assigned-orders/:delivererId')
  @ApiOperation({ summary: 'Get all orders assigned to a deliverer' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully.',
  })
  async getAssignedOrders(@Param('delivererId') delivererId: string) {
    return this.delivererService.getAssignedOrders(delivererId);
  }
  @Get('admin/:adminId')
  @Roles(Role.HOTEL_ADMIN) // Optionally restrict access if needed
  @ApiOperation({
    summary: 'Get all deliverers managed by a specific hotel admin',
  })
  @ApiResponse({
    status: 200,
    description:
      'Deliverers managed by the hotel admin retrieved successfully.',
  })
  async getDeliverersByHotelAdmin(@Param('adminId') adminId: string) {
    return this.delivererService.getDeliverersByHotelAdmin(adminId);
  }
}
