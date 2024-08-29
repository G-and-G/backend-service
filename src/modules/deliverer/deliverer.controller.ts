import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { DelivererService } from './deliverer.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssignOrderDto, CreateDelivererDto, UpdateDelivererDto } from './deliverer.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/guards/role.guard';


@ApiTags('deliverers')
@Controller('deliverers')
export class DelivererController {
  constructor(private readonly delivererService: DelivererService) {}

  @Post("/create")
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Create a new deliverer for a specific hotel' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The deliverer has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async createDeliverer(
    @Body() createDelivererDto: CreateDelivererDto,
    @Query('hotelId') hotelId: number,
  ) {
    try {
      const result = await this.delivererService.createDeliverer(createDelivererDto, hotelId);
      return result;
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        response: { message: 'Failed to create deliverer', error: error.message },
      };
    }
  }

  @Put('update/:id')
  @Roles(Role.HOTEL_ADMIN)

  @ApiOperation({ summary: 'Update a deliverer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deliverer has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deliverer not found.',
  })
  async updateDeliverer(
    @Param('id') id: string,
    @Body() updateDelivererDto: UpdateDelivererDto,
  ) {
    try {
      const result = await this.delivererService.updateDeliverer(id, updateDelivererDto);
      return result;
    } catch (error) {
      return {
        status: HttpStatus.NOT_FOUND,
        response: { message: 'Failed to update deliverer', error: error.message },
      };
    }
  }

  @Delete('delete/:id')
  @Roles(Role.HOTEL_ADMIN)

  @ApiOperation({ summary: 'Delete a deliverer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deliverer has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deliverer not found.',
  })
  async deleteDeliverer(@Param('id') id: string) {
    try {
      const result = await this.delivererService.deleteDeliverer(id);
      return result;
    } catch (error) {
      return {
        status: HttpStatus.NOT_FOUND,
        response: { message: 'Failed to delete deliverer', error: error.message },
      };
    }
  }

  @Post('assign-order')
  @Roles(Role.HOTEL_ADMIN)

  @ApiOperation({ summary: 'Assign an order to a deliverer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The order has been successfully assigned.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to assign order.',
  })
  async assignOrder(@Body() assignOrderDto: AssignOrderDto) {
    try {
      const result = await this.delivererService.assignOrder(assignOrderDto);
      return result;
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        response: { message: 'Failed to assign order', error: error.message },
      };
    }
  }

  @Get('hotel/:hotelId')
  @Roles(Role.HOTEL_ADMIN)

  @ApiOperation({ summary: 'Get all deliverers for a specific hotel' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deliverers retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No deliverers found for the specified hotel.',
  })
  async getDeliverersByHotel(@Param('hotelId') hotelId: number) {
    try {
      const result = await this.delivererService.getDeliverersByHotel(hotelId);
      return result;
    } catch (error) {
      return {
        status: HttpStatus.NOT_FOUND,
        response: { message: 'Failed to retrieve deliverers', error: error.message },
      };
    }
  }
  
  @Get('assigned-orders/:delivererId')
  @ApiOperation({ summary: 'Get all orders assigned to a deliverer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No orders found for the specified deliverer.',
  })
  async getAssignedOrders(@Param('delivererId') delivererId: string) {
    try {
      const result = await this.delivererService.getAssignedOrders(delivererId);
      return result;
    } catch (error) {
      return {
        status: HttpStatus.NOT_FOUND,
        response: { message: 'Failed to retrieve orders', error: error.message },
      };
    }
  }

}

