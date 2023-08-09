import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlingMiddleware implements NestMiddleware {
    
  use(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpException) {
      return res.status(err.getStatus()).json({
        message: err.message,
      });
    }

    console.error(err); 
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}
