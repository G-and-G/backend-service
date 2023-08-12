// import { PrismaService } from "src/prisma.service";
import { PrismaService } from "prisma/prisma.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";


@Injectable()
export class UserService{

     constructor(private prisma: PrismaService){}

     async getAllUser():Promise<User[]>{
          return this.prisma.user.findMany()
     }


     async createUser(data:User): Promise<User>{
        try {
            const existing = await this.prisma.user.findUnique({
                where: {
                  email: data.email,
                },
              });
          
              if (existing) {
                throw new ConflictException('email already exists');
              }
          
              return this.prisma.user.create({
                data,
              });
        } catch (error) {
             
        }
         
     }
}