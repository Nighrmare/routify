/* eslint-disable @typescript-eslint/no-unsafe-return */
import { LoggingInterceptor } from './logging-console.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  const mockContext: Partial<ExecutionContext> = {
    switchToHttp: () =>
      ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
        getNext: () => null,
      }) as any,
  };

  it('should log request and response', (done) => {
    const mockHandler: CallHandler = {
      handle: () => of('OK'),
    };

    interceptor
      .intercept(mockContext as ExecutionContext, mockHandler)
      .subscribe(() => {
        expect(console.log).toHaveBeenCalledWith(
          expect.stringMatching(/^\[.*\] GET \/test = 200 \| \d+ms$/),
        );
        done();
      });
  });
});
