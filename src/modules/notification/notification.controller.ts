import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateDeviceDTO } from '../user/dto/create-device-dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('notification')
@ApiTags('notification')
@ApiBearerAuth('JWT-auth')
export class NotificationController {
    constructor(private userService: UserService){}
    @UseGuards(AuthGuard)
    @Post('/subscribe')
    async subscribeToNotifications(@Body() createDeviceDTO:CreateDeviceDTO,@Request() req:any){
     const {id} = req.user;
     console.log(req.user);
     return this.userService.savePlayerId(createDeviceDTO,id);
    }

    @Post('/unsubscribe')
    async unSubscribeToNotifications(@Request() req:any){
     const {id} = req.user;
     return this.userService.unSubscribeFromNotifications(id);
    }
}
