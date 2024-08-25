import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('[APPLICATION LOG]: Checking authentication...');
    const token = request.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
      const tokenValue = token.split(' ')[1];
      try {
        const decodedToken = this.jwtService.verify(tokenValue);
        console.log('[APPLICATION LOG]: Authentication successful.');
        console.log('[APPLICATION LOG]: User: ', decodedToken);
        request.user = decodedToken;
        return true;
      } catch (error) {
        return false;
      }
    }
  }
}
