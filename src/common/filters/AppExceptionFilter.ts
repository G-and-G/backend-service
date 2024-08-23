import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import ApiResponse from 'src/utils/ApiResponse';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    console.log('🚨  Exception: ', exception.getResponse());

    if (status === 400) {
      if (exception.getResponse() instanceof Object) {
        if (exception.getResponse()['message'][0].length === 1) {
          return response
            .status(status)
            .json(ApiResponse.error(exception.getResponse()['message']));
        }
        return response
          .status(status)
          .json(ApiResponse.error(exception.getResponse()['message'][0]));
      } else if (exception.getResponse() instanceof String) {
        return response
          .status(status)
          .json(ApiResponse.error(exception.getResponse().toString()));
      }
      return response
        .status(status)
        .json(
          ApiResponse.error(
            exception.getResponse().toString(),
            exception.getResponse(),
          ),
        );
    } else if (status === 401) {
      response
        .status(status)
        .json(
          ApiResponse.error(
            exception.getResponse()['message'],
            exception.getResponse(),
          ),
        );
    } else if (status === 404) {
      response
        .status(status)
        .json(
          ApiResponse.error(
            exception.getResponse()['message'],
            exception.getResponse(),
          ),
        );
    } else if (status === 403) {
      response
        .status(status)
        .json(ApiResponse.error('Forbidden', exception.getResponse()));
    } else {
      response
        .status(status)
        .json(ApiResponse.error('Error occured', exception));
    }
  }
}
