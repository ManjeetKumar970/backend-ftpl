import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Response } from 'express';

@Catch(HttpException)
export class GqlHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctxType = host.getType<'http' | 'rpc' | 'ws'>(); // Get the request type

    // Extract error information
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    let message = 'Something went wrong, please try again later';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      message = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message[0]
        : exceptionResponse.message;
    }

    if (ctxType === 'http') {
      // ✅ Handle REST API error response
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      response.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        error: exception.name || 'Error',
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      });
    } else {
      // ✅ Handle GraphQL error response
      return new GraphQLError(message, {
        extensions: {
          status: 'error',
          statusCode,
          error: exception.name,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }
}
