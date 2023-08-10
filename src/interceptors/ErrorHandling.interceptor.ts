import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        if (err instanceof HttpException) {
          // Handle HttpException
          return throwError(err);
        } else {
          // Handle other errors
          const errorResponse = {
            message: 'Internal Server Error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
          return throwError(new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR));
        }
      }),
    );
  }
}
