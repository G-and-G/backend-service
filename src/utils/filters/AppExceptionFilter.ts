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
    let responseObject = ApiResponse.error(
      'Bad Request',
      exception.getResponse(),
    );
    if (status === 400) {
      console.log('400 status code error');
      if (Object.keys(exception.getResponse()).includes('message')) {
        responseObject = ApiResponse.error(
          exception.getResponse()['message'][0],
          exception.getResponse(),
        );
      }
      response.status(status).json(responseObject);
    } else {
      response
        .status(status)
        .json(ApiResponse.error('Internal server error', exception));
    }
  }
}
