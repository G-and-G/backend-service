import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Get,
  HttpStatus,
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

  @Post('/create')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Create a new deliverer for a specific hotel' })
  @ApiResponse({
    status: 201,
    description: 'The deliverer has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async createDeliverer(
    @Body() createDelivererDto: CreateDelivererDto,
    @Query('hotelId') hotelId: number,
  ) {
    try {
      const result = await this.delivererService.createDeliverer(createDelivererDto, hotelId);
      return {
        status: 201,
        response: result,
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to create deliverer', error: error.message },
      };
    }
  }

  @Put('update/:id')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Update a deliverer' })
  @ApiResponse({
    status: 200,
    description: 'The deliverer has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async updateDeliverer(
    @Param('id') id: string,
    @Body() updateDelivererDto: UpdateDelivererDto,
  ) {
    try {
      const result = await this.delivererService.updateDeliverer(id, updateDelivererDto);
      return {
        status: 200,
        response: result,
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to update deliverer', error: error.message },
      };
    }
  }

  @Delete('delete/:id')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Delete a deliverer' })
  @ApiResponse({
    status: 200,
    description: 'The deliverer has been successfully deleted.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async deleteDeliverer(@Param('id') id: string) {
    try {
      const result = await this.delivererService.deleteDeliverer(id);
      return {
        status: 200,
        response: result,
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to delete deliverer', error: error.message },
      };
    }
  }

  @Post('assign-order')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Assign an order to a deliverer' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully assigned.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to assign order.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async assignOrder(@Body() assignOrderDto: AssignOrderDto) {
    try {
      const result = await this.delivererService.assignOrder(assignOrderDto);
      return {
        status: 200,
        response: result,
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to assign order', error: error.message },
      };
    }
  }

  @Get('hotel/:hotelId')
  @Roles(Role.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Get all deliverers for a specific hotel' })
  @ApiResponse({
    status: 200,
    description: 'Deliverers retrieved successfully.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getDeliverersByHotel(@Param('hotelId') hotelId: number) {
    try {
      const result = await this.delivererService.getDeliverersByHotel(hotelId);
      return {
        status: 200,
        response: result,
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to retrieve deliverers', error: error.message },
      };
    }
  }

  @Get('assigned-orders/:delivererId')
  @ApiOperation({ summary: 'Get all orders assigned to a deliverer' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getAssignedOrders(@Param('delivererId') delivererId: string) {
    try {
      const result = await this.delivererService.getAssignedOrders(delivererId);
      return {
        status: 200,
        response: result,
      };
    } catch (error) {
      return {
        status: 500,
        response: { message: 'Failed to retrieve orders', error: error.message },
      };
    }
  }
}
