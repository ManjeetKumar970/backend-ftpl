import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    this.logger.error(`GraphQL Error: ${exception.message}`, exception.stack);

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return {
        statusCode: exception.getStatus(),
        message: response['message'] || exception.message,
      };
    }

    return {
      statusCode: 500,
      message: 'Internal server error. Please try again later.',
    };
  }
}
