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
    let errorCode = 'UNKNOWN_ERROR';
    let timestamp = new Date().toISOString();
    let path = request.url;

    if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const responseObj = exceptionResponse as Record<string, any>;

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

      // Extract additional custom properties (if available)
      if (responseObj.errorCode) {
        errorCode = responseObj.errorCode;
      }
      if (responseObj.timestamp) {
        timestamp = responseObj.timestamp;
      }
      if (responseObj.path) {
        path = responseObj.path;
      }
    }

    // Send JSON response
    response.status(status).json({
      error: errorType,
      statusCode: status,
      message: errorMessage,
      errorCode: errorCode,
      timestamp: timestamp,
      path: path,
    });
  }
}
