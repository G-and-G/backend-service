import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
                    // role:dto.role,
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
    async makeUserAdmin(userId: string) {
        try {
            const updatedUser = await this.prisma.users.update({
                where: {
                    id: userId,
                },
                data: {
                    role: 'ADMIN', // Set the role to 'admin'
                },
            });

            return ApiResponse.success("User role updated to admin successfully", updatedUser);
        } catch (error) {
            console.log("Error updating user role:", error);
            return ApiResponse.error("Error updating user role", error);
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

    async getAllUsers() {
        try {
            const users = await this.prisma.users.findMany();
            return users;
        } catch (error) {
            console.log("Error getting all users:", error);
            throw error;
        }
    }

    async searchUsers(query: string) {
        try {
            const users = await this.prisma.users.findMany({
                where: {
                    OR: [
                        {
                            first_name: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            last_name: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            email: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
            });
            return users;
        } catch (error) {
            console.log("Error searching users:", error);
            throw error;
        }
    }

    async deleteUserById(id: string) {
        try {
            const deletedUser = await this.prisma.users.delete({
                where: {
                    id,
                },
            });
            return deletedUser;
        } catch (error) {

            
            console.log("Error deleting user:", error);
            throw error;
        }
    }
    // async   updateResetToken(userId: number, resetToken: string): Promise<void> {
    //     try {
    //         const updatedUser= await this.prisma.users.update({
    //             where: { id: userId },
    //             data: { resetToken   },
    //         });

    //         if (!updatedUser) {
    //             throw new NotFoundException('User not found');
    //         }
    //     } catch (error) {
    //         console.log("Error updating reset token:", error);
    //         throw error;
    //     }
    // }


}
