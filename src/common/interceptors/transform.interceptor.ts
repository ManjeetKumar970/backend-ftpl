import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        // Type guard to check if an object has a 'message' property
        function hasMessageProperty(obj: any): obj is { message: string } {
          return typeof obj === 'object' && obj !== null && 'message' in obj;
        }

        // Extract message if available
        const message = hasMessageProperty(data) ? data.message : null;

        // Ensure immutability by creating a shallow copy
        const sanitizedData =
          typeof data === 'object' && data !== null
            ? { ...data } // Clone object
            : data;

        // Remove message if present
        if (hasMessageProperty(sanitizedData)) {
          delete sanitizedData.message;
        }

        // Check if sanitizedData is empty
        const isEmptyObject =
          typeof sanitizedData === 'object' &&
          sanitizedData !== null &&
          Object.keys(sanitizedData).length === 0;

        // Construct the response object
        const response: any = {
          status: 'success',
          statusCode,
          message,
          timestamp: new Date().toISOString(),
        };

        // Include data only if sanitizedData is not empty
        if (!isEmptyObject) {
          response.data = sanitizedData;
        }

        return response;
      }),
    );
  }
}
