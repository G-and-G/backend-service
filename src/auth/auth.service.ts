import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto, SignInDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constants';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async signup(dto: AuthDto) {
    const { email, password, telephone, gender, username, fullName } = dto;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) throw new Error('Email already exists');
    const hashedPassword = await this.hashPassword(password);
    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        telephone,
        gender,
        username,
        fullName,
      },
    });
    return { message: 'Signup was successful' };
  }
  async signin(dto: SignInDTO,req: Request, res: Response) {
    const { email, password } = dto;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (!foundUser) throw new Error('wrong credentials');
    const isMatch = await this.comparePassword({
      password,
      hashedPassword: foundUser.password,
    });
    if (!isMatch) throw new BadRequestException('wrong credentials');
    const token = await this.signToken({
      id: foundUser.user_id,
      email: foundUser.email,
    });

    return { token };
  }
  async signout() {}
  async hashPassword(password: string) {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }
  async comparePassword(args: { password: string; hashedPassword: string }) {
    return await bcrypt.compare(args.password, args.hashedPassword);
  }
  async signToken(args: { id: string; email: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
}
