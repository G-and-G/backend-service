import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check if the user is authenticated (you can use req.user or req.isAuthenticated() here)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the user has the necessary permissions to access the route
    // You can implement your authorization logic here

    next();
  }
}
