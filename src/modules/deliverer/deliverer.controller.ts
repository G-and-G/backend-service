import {
    Body,
    Controller,
    Param,
    Post,
    Get,
    Put,
    Delete,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
  import { DelivererService } from './deliverer.service';
  import { CreateDelivererDto, UpdateDelivererDto, AssignOrderDto } from './deliverer.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/guards/role.guard';

  
  @ApiTags('deliverers')
  @Controller('deliverers')
  export class DelivererController {
    constructor(private readonly delivererService: DelivererService) {}
  
    @Post('create/:hotelId')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new deliverer' })
    @ApiParam({
      name: 'hotelId',
      type: String,
      description: 'Unique identifier of the hotel where the deliverer is assigned',
      example: 'e0c3a452-872a-4ad6-bd41-3b7d8a1b894f',
    })
    @ApiResponse({ status: 201, description: 'Deliverer created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async createDeliverer(
      @Param('hotelId') hotelId: string,
      @Body() createDelivererDto: CreateDelivererDto,
    ) {
      const result = await this.delivererService.createDeliverer(hotelId, createDelivererDto);
      return {
        status: result.status,
        response: result.response,
      };
    }
  
    @Get('deliverer/:id')
    @ApiOperation({ summary: 'Retrieve a deliverer by ID' })
    @ApiParam({
      name: 'id',
      type: String,
      description: 'Unique identifier of the deliverer',
      example: '9b7f43f6-493a-4e4f-bb4b-1c59f9c28f92',
    })
    @ApiResponse({ status: 200, description: 'Deliverer retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Deliverer not found' })
    async getDelivererById(@Param('id') delivererId: string) {
      const result = await this.delivererService.getDelivererById(delivererId);
      return {
        status: result.status,
        response: result.response,
      };
    }
  
    @Put('updateDeliverer/:id')
    @Roles(Role.ADMIN)

    @ApiOperation({ summary: 'Update deliverer details' })
    @ApiParam({
      name: 'id',
      type: String,
      description: 'Unique identifier of the deliverer',
      example: '9b7f43f6-493a-4e4f-bb4b-1c59f9c28f92',
    })
    @ApiResponse({ status: 200, description: 'Deliverer updated successfully' })
    @ApiResponse({ status: 404, description: 'Deliverer not found' })
    async updateDeliverer(
      @Param('id') delivererId: string,
      @Body() updateDelivererDto: UpdateDelivererDto,
    ) {
      const result = await this.delivererService.updateDeliverer(delivererId, updateDelivererDto);
      return {
        status: result.status,
        response: result.response,
      };
    }
  
    @Delete('deleteDeliverer/:id')
    @Roles(Role.ADMIN)

    @ApiOperation({ summary: 'Delete a deliverer' })
    @ApiParam({
      name: 'id',
      type: String,
      description: 'Unique identifier of the deliverer',
      example: '9b7f43f6-493a-4e4f-bb4b-1c59f9c28f92',
    })
    @ApiResponse({ status: 200, description: 'Deliverer deleted successfully' })
    @ApiResponse({ status: 404, description: 'Deliverer not found' })
    async deleteDeliverer(@Param('id') delivererId: string) {
      const result = await this.delivererService.deleteDeliverer(delivererId);
      return {
        status: result.status,
        response: result.response,
      };
    }
  
    @Post(':id/assign-order')
    @Roles(Role.ADMIN)

    @ApiOperation({ summary: 'Assign an order to a deliverer' })
    @ApiParam({
      name: 'id',
      type: String,
      description: 'Unique identifier of the deliverer',
      example: '9b7f43f6-493a-4e4f-bb4b-1c59f9c28f92',
    })
    @ApiResponse({ status: 200, description: 'Order assigned successfully' })
    @ApiResponse({ status: 404, description: 'Deliverer or order not found' })
    async assignOrder(
      @Param('id') delivererId: string,
      @Body() assignOrderDto: AssignOrderDto,
    ) {
      const result = await this.delivererService.assignOrder(delivererId, assignOrderDto);
      return {
        status: result.status,
        response: result.response,
      };
    }
  
    @Get(':id/orders')
    @ApiOperation({ summary: 'Retrieve orders assigned to a deliverer' })
    @ApiParam({
      name: 'id',
      type: String,
      description: 'Unique identifier of the deliverer',
      example: '9b7f43f6-493a-4e4f-bb4b-1c59f9c28f92',
    })
    @ApiResponse({ status: 200, description: 'Orders for deliverer retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Deliverer not found' })
    async getOrdersByDeliverer(@Param('id') delivererId: string) {
      const result = await this.delivererService.getOrdersByDeliverer(delivererId);
      return {
        status: result.status,
        response: result.response,
      };
    }
  }
  