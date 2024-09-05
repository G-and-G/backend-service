import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InviteService } from './invite.service';

@ApiTags('invites')
@Controller('invites')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}
}
