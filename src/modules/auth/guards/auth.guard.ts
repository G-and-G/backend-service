import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/guards/role.guard';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('[APPLICATION LOG]: Checking authentication...');

    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decodedToken = this.jwtService.verify(token);
        console.log('[APPLICATION LOG]: Authentication successful.');
        console.log('[APPLICATION LOG]: User:', decodedToken);

        request.user = {
          ...decodedToken,
          role: Role[decodedToken.role as keyof typeof Role],
        }; // Attaching the user to the request object
        return true;
      } catch (error) {
        console.log(
          '[APPLICATION LOG]: Authentication failed - Invalid token.',
        );
        return false;
      }
    }

    console.log(
      '[A PPLICATION LOG]: Authentication failed - No token provided.',
    );
    return false;
  }
}
