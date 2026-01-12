import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import ApiResponse from '../ApiResponse';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    console.log(`[APPLICATION LOG]: Error with status ${status}`);
    let responseObject = ApiResponse.sendError(
      'Bad Request',
      exception.getResponse(),
    );
    if (status === 400) {
      console.log('400 status code error');
      if (Object.keys(exception.getResponse()).includes('message')) {
        const message = exception.getResponse()['message'];
        responseObject = ApiResponse.sendError(
          Array.isArray(message) ? message[0] : message,
          exception.getResponse(),
        );
      }
      response.status(status).json(responseObject);
    } else {
      response
        .status(status)
        .json(
          ApiResponse.sendError('Internal server error', exception, status),
        );
    }
  }
}
