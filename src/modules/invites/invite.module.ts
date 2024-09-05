import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

@Module({
  providers: [PrismaService, InviteService],
  controllers: [InviteController],
  exports: [],
})
export class InviteModule {}
