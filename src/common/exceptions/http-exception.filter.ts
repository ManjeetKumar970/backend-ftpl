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

    // Determine HTTP status
    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract response message
    const exceptionResponse = exception.getResponse();
    let message = 'Something went wrong, please try again later';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const messages = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message
        : [exceptionResponse.message];

      message =
        messages.length > 0
          ? messages[0]
          : 'Something went wrong, please try again later';
    }

    response.status(status).json({
      error: exception.name || 'Bad Request',
      statusCode: status,
      message, // Ensure message is a string
    });
  }
}
