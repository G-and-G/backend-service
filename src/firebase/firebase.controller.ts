import { Body, Controller, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { sendNotificationToClient } from 'src/notification/notify';
import ApiResponse from 'src/utils/ApiResponse';
const prisma = new PrismaClient();
@Controller('firebase')
export class FirebaseController {
  @Post('/token/:hotelId/:token')
  async receiveToken(@Param('token') token: string,@Param('hotelId') hotelId:number ) {
    console.log('token',token)
   try {
    let hotel = await prisma.hotel.findUnique({
      where:{
        hotel_id:Number(hotelId)
      }
    });

    if(!hotel){
      throw new NotFoundException('Hotel not found!');
    }
    await prisma.hotel.update({
        where:{
          hotel_id:Number(hotelId)
        },
        data:{
          notificationToken:token
        }
      });
    return ApiResponse.success("Token received",null,200);
   } catch (error) {
    console.log(error)
    return ApiResponse.error("Something went wrong" + error.message,null,error.status)
   }
  }

  @Post('/notificationTest/:hotelId')
  async testNotification(@Body() body:any,@Param('hotelId') hotelId:number){
    console.log('HotelId',hotelId)
    try {
      let hotel = await prisma.hotel.findUnique({
        where:{
          hotel_id:Number(hotelId)
        }
      });
      if(!hotel){
        throw new NotFoundException('Hotel not found!');
      }
      const notificationData = {
        title: 'New message',
        body:"Work harder than before",
      };
      console.log(hotel);
      sendNotificationToClient([hotel.notificationToken],notificationData);
    } catch (error) {
      console.log(error)
      return ApiResponse.error('Something went wrong' +  error.message,null,error.status);
    }
  }
}
