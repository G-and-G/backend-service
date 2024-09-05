import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from '../user/user.service';
import { DelivererController } from './deliverer.controller';
import { DelivererService } from './deliverer.service';
// Adjust the import path based on your project structure

@Module({
  controllers: [DelivererController],
  providers: [DelivererService, PrismaService, UserService],
  exports: [DelivererService], // Exporting if other modules need to use DelivererService
})
export class DelivererModule {}
