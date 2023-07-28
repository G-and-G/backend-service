import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService) { }
    async signup(dto:AuthDto) {
        const {email, password} = dto
        return  {message: 'Signup route'}
    }
    async signin() {}
    async signout() {}

}
