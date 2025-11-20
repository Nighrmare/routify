/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LogsService } from 'src/modules/logs/logs.service';

// Interface for JWT payload
interface JwtUserPayload {
  userId: number;
  email: string;
  role: string;
}

@Injectable()
export class LoggingDbInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {
    void this.logsService;
  }

  // Intercept all HTTP requests to log data to the database
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();

    // Helper to extract email from request
    const extractUserEmail = (
      req: Request & { user?: JwtUserPayload },
    ): string | null => {
      if (req.user?.email) return req.user.email;

      if (req.body && typeof req.body.email === 'string') {
        return req.body.email;
      }

      return null;
    };

    // Helper to extract user ID from request
    const extractUserId = (
      req: Request & { user?: JwtUserPayload },
    ): number | null => {
      return req.user?.userId ?? null;
    };

    return next.handle().pipe(
      tap(() => {
        const http = context.switchToHttp();
        const req = http.getRequest<Request & { user?: JwtUserPayload }>();
        const res = http.getResponse<Response>();

        // Extract request details
        const { method, url } = req;
        const status = res.statusCode;
        const duration = Date.now() - start;
        const userId = extractUserId(req);
        const userEmail = extractUserEmail(req);

        // Save log to database
        void this.logsService
          .saveLog({
            method,
            url,
            status,
            durationMs: duration,
            userId,
            userEmail,
          })
          .catch((e: unknown) => {
            console.error('Error saving log to DB:', e);
          });
      }),

      // Handle errors and log them to DB
      catchError((err: unknown) => {
        const http = context.switchToHttp();
        const req = http.getRequest<Request & { user?: JwtUserPayload }>();

        const { method, url } = req;
        const duration = Date.now() - start;
        const status =
          typeof err === 'object' && err !== null && 'status' in err
            ? ((err as { status?: number }).status ?? 500)
            : 500;

        const userId = extractUserId(req);
        const userEmail = extractUserEmail(req);

        // Save error log to database
        void this.logsService
          .saveLog({
            method,
            url,
            status,
            durationMs: duration,
            userId,
            userEmail,
          })
          .catch((e: unknown) => {
            console.error('Error saving the error log to the database:', e);
          });

        return throwError(() => err as Error);
      }),
    );
  }
}
