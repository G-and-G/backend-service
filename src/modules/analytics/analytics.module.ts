import { Module } from '@nestjs/common';
// import { AnalyticsController } from './analytics.controller';
import { AnalyticsController } from './analytic.controller';
import { AnalyticsService } from './analytics.service';
// import { PrismaService } from '../prisma/prisma.service'; // Adjust the path as needed
import { PrismaService } from 'prisma/prisma.service'; 

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService],
})
export class AnalyticsModule {}
