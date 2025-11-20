import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface RequestUser {
  userId: number;
  email: string;
}

@Catch()
// Global exception filter to handle all thrown errors
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { user?: RequestUser }>();

    // Determine error status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get the raw error message or fallback text
    const raw =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'INTERNAL SERVER ERROR';

    // Extract message if response is an object
    const errorResponse =
      typeof raw === 'object' && raw !== null && 'message' in raw
        ? (raw.message as string | string[])
        : raw;

    // Build standardized error payload
    const errorPayload = {
      success: false,
      statusCode: status,
      message: errorResponse,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // Log the error details to console
    console.error(
      `[Error ${status}] ${request.method} ${request.url} -`,
      errorResponse,
    );

    // Send formatted error response
    response.status(status).json(errorPayload);
  }
}
