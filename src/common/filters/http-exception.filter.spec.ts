/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AllExceptionsFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<
    Request & { user?: { userId: number; email: string } }
  >;

  const createMockHost = () =>
    ({
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    }) as unknown as ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test-endpoint',
      method: 'GET',
      user: { userId: 1, email: 'test@example.com' },
    };
  });

  it('should handle HttpException with object response correctly', () => {
    const exception = new HttpException(
      { error: 'CustomError', message: 'Something went wrong' },
      HttpStatus.BAD_REQUEST,
    );

    const mockHost = createMockHost();

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong',
        path: '/test-endpoint',
        timestamp: expect.any(String),
      }),
    );
  });

  it('should handle HttpException where message is an array', () => {
    const exception = new HttpException(
      { message: ['a', 'b'], error: 'BadRequest' },
      HttpStatus.BAD_REQUEST,
    );

    const mockHost = createMockHost();

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: ['a', 'b'],
      }),
    );
  });

  it('should handle HttpException where response is a string', () => {
    const exception = new HttpException('Simple error', HttpStatus.FORBIDDEN);

    const mockHost = createMockHost();

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Simple error',
        statusCode: HttpStatus.FORBIDDEN,
      }),
    );
  });

  it('should handle unknown exception with INTERNAL_SERVER_ERROR', () => {
    const exception = new Error('Unknown error');

    const mockHost = createMockHost();

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'INTERNAL SERVER ERROR',
        path: '/test-endpoint',
        timestamp: expect.any(String),
      }),
    );
  });
});
