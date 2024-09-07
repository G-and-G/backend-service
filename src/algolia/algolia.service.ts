import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';
import { algoliaClient } from 'src/config/algoliasearch';
import ApiResponse from 'src/utils/ApiResponse';

@Injectable()
export class AlgoliaService {
  private readonly logger = new Logger(AlgoliaService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron('5 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }

  // every day at 2:00 AM
  @Cron('0 2 * * *')
  async uploadMenuItems() {
    try {
      const menuItems = await this.prisma.menuItem.findMany({
        include: {
          sub_category: true,
        },
      });
      console.log('menuItems', menuItems);
      const index = algoliaClient.initIndex('menuItems');
      const withObjectID = menuItems.map((item) => {
        return {
          ...item,
          objectID: item.id,
        };
      });
      const res = await index.saveObjects(withObjectID);
      return ApiResponse.success('Uploaded successfully', res, 200);
    } catch (error) {
      this.logger.error('error uploading menu items', error);
      return ApiResponse.error(error.message, null, error.status);
    }
  }

  // upload hotels
  @Cron('0 2 * * *')
  async uploadHotels() {
    try {
      const hotels = await this.prisma.hotel.findMany({
        include: {
          menu: true,
          address: true,
        },
      });
      const index = algoliaClient.initIndex('hotels');
      const withObjectID = hotels.map((hotel) => {
        return {
          ...hotel,
          objectID: hotel.id,
        };
      });
      const res = await index.saveObjects(withObjectID);
      return ApiResponse.success('Uploaded successfully', res, 200);
    } catch (error) {
      this.logger.error('error uploading hotels', error);
      return ApiResponse.error(error.message, null, error.status);
    }
  }
}
