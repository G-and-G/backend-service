import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DelivererService } from './deliverer.service';

@ApiTags('deliverers')
@Controller('deliverers')
export class DelivererController {
  constructor(private readonly delivererService: DelivererService) {}
}
