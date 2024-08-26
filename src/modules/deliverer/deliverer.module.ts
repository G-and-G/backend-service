import { Module } from '@nestjs/common';
import { DelivererController } from './deliverer.controller';
import { DelivererService } from './deliverer.service';
import { PrismaService } from 'prisma/prisma.service';
 // Adjust the import path based on your project structure

@Module({
  controllers: [DelivererController],
  providers: [DelivererService, PrismaService],
  exports: [DelivererService], // Exporting if other modules need to use DelivererService
})
export class DelivererModule {}
