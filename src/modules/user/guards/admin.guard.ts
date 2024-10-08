import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { UserService } from '../user.service';

export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('[APPLICATION LOG]: Checking admin...');
    const token = request.headers.authorization;
    if (token?.startsWith('Bearer ')) {
      const tokenValue = token.split(' ')[1];
      console.log(tokenValue);
      try {
        const decodedToken = this.jwtService.verify(tokenValue);
        const user = await this.userService.getUserById(decodedToken.id);
        if (user.role !== Role.HOTEL_ADMIN) {
          return false;
        }
        console.log('[APPLICATION LOG]: Admin check successful.');
        console.log('[APPLICATION LOG]: User: ', decodedToken);
        request.user = { ...decodedToken, hotel_id: user.hotelId };
        return true;
      } catch (error) {
        console.log('[APPLICATION LOG]: Admin check failed.', error);
        return false;
      }
    }
  }
}
