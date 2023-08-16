import { ConflictException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MailService } from 'src/mail/mail.service';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDTO } from './dto/create-user.dto';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import ApiResponse from 'src/utils/ApiResponse';
import { hash } from 'bcrypt'

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService, private mailService: MailService) { }

    async createUser(dto: RegisterDTO) {
        try {
            const hashedPassword = await hash(dto.password, 10)
            const user = await this.prisma.users.create({
                data: {
                    role:dto.role,
                    first_name: dto.firstName,
                    last_name: dto.lastName,
                    email: dto.email,
                    password: hashedPassword,
                }
            })
            // await this.mailService.sendWelcomeEmail({ names: `${user.first_name} ${user.last_name}`, email: user.email })
            return ApiResponse.success("User Created successfully", user);
        } catch (error) {
            if (error.code === 'P2002') {
                const key = error.meta.target[0]
                return ApiResponse.error(`${key.charAt(0).toUpperCase() + key.slice(1)} already exists`, error);
            }
            console.log(Object.keys(error))
            return ApiResponse.error("Internal server error", error);
        }
    }

    async getUserById(id: string) {
        const user = this.prisma.users.findUnique({
            where: {
                id
            }
        })
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.prisma.users.findUnique({
            where: {
                email
            }
        })
        return user;
    }

}
