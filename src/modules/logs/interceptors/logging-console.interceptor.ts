import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // Intercept all HTTP requests to log method, URL, status, and duration
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        // Get request and response objects
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();

        // Extract method, URL, status, and calculate duration
        const method = req.method;
        const url = req.url;
        const status = res.statusCode;
        const duration = Date.now() - start;

        // Format timestamp
        const timestamp = new Date().toLocaleString('es-CO');

        // Log request details to console
        console.log(
          `[${timestamp}] ${method} ${url} = ${status} | ${duration}ms`,
        );
      }),
    );
  }
}
