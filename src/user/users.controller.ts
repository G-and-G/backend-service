import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import {Request,Response} from 'express'
// import { JwtAuthGuard } from "src/authentication/auth.guard";
import { JwtAuthGuard } from "src/auth/auth.guard";


@Controller('user')
export class UsersController {
     constructor(private readonly UserService : UserService){}

     @Get()
     @UseGuards(JwtAuthGuard)
     async getAllUsers(@Req() request: Request, @Res() response: Response):Promise<any>{
          try{
               const result = await this.UserService.getAllUser();
               return response.status(200).json({
                    status: 'Ok!',
                    message: 'Successfully fetch data!',
                    result: result
               })
          }catch(err){
               return response.status(500).json({
                    status: 'Ok!',
                    message : 'Internal Server Error!'
               })
          }
     }
}