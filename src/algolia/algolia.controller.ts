import { Controller, Post } from '@nestjs/common';
import { AlgoliaService } from './algolia.service';

// @ApiTags('Algolia')
@Controller('algolia')
export class AlgoliaController {
  constructor(private readonly algoliaService: AlgoliaService) {}

  @Post('upload-menu-items')
  async uploadMenuItems() {
    return await this.algoliaService.uploadMenuItems();
  }

  @Post('upload-hotels')
  async uploadHotels() {
    return await this.algoliaService.uploadHotels();
  }
}
