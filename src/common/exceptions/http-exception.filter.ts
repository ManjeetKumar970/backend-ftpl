import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Get the HTTP status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract exception response
    const exceptionResponse = exception.getResponse();
    let errorMessage = 'Something went wrong';
    let errorType = 'Error';

    if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const responseObj = exceptionResponse as {
        message?: string | string[];
        error?: string;
      };

      // Extract message: If it's an array, take the first element; otherwise, use it as a string
      if (
        Array.isArray(responseObj.message) &&
        responseObj.message.length > 0
      ) {
        errorMessage = responseObj.message[0];
      } else if (typeof responseObj.message === 'string') {
        errorMessage = responseObj.message;
      }

      // Extract error type if available
      if (responseObj.error) {
        errorType = responseObj.error;
      }
    }

    // Send JSON response
    response.status(status).json({
      error: errorType,
      statusCode: status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
