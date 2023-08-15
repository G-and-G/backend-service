import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction, err?: any) {
    if (err instanceof HttpException) {
      return res.status(err.getStatus()).json({
        message: err,
      });
    }
 
    console.error('Error',err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}
