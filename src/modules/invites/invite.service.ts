import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class InviteService {
  constructor(private readonly prisma: PrismaService) {}
}
