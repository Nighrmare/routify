/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LoggingDbInterceptor } from './logging-db.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { LogsService } from '../logs.service';

describe('LoggingDbInterceptor', () => {
  let interceptor: LoggingDbInterceptor;
  let logsService: LogsService;

  beforeEach(() => {
    logsService = {
      saveLog: jest.fn().mockResolvedValue(undefined),
    } as unknown as LogsService;

    interceptor = new LoggingDbInterceptor(logsService);
    jest.clearAllMocks();
  });

  const createContext = (user?: any, bodyEmail?: any) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          user,
          body: bodyEmail !== undefined ? { email: bodyEmail } : {},
        }),
        getResponse: () => ({ statusCode: 200 }),
      }),
    }) as unknown as ExecutionContext;

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log using req.user (normal flow)', (done) => {
    const user = { userId: 1, email: 'user@example.com', role: 'admin' };
    const context = createContext(user);

    const handler: CallHandler = { handle: () => of('ok') };

    interceptor.intercept(context, handler).subscribe(() => {
      expect(logsService.saveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/test',
          status: 200,
          userId: 1,
          userEmail: 'user@example.com',
        }),
      );
      done();
    });
  });

  it('should log using req.body.email if no req.user', (done) => {
    const context = createContext(undefined, 'body@example.com');
    const handler: CallHandler = { handle: () => of('ok') };

    interceptor.intercept(context, handler).subscribe(() => {
      expect(logsService.saveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: null,
          userEmail: 'body@example.com',
        }),
      );
      done();
    });
  });

  it('should log null userId and userEmail if none found', (done) => {
    const context = createContext(undefined, undefined);
    const handler: CallHandler = { handle: () => of('ok') };

    interceptor.intercept(context, handler).subscribe(() => {
      expect(logsService.saveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: null,
          userEmail: null,
        }),
      );
      done();
    });
  });

  it('should return null userEmail when req.body.email is not a string', (done) => {
    const context = createContext(undefined, 123);
    const handler: CallHandler = { handle: () => of('ok') };

    interceptor.intercept(context, handler).subscribe(() => {
      expect(logsService.saveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: null,
          userEmail: null,
        }),
      );
      done();
    });
  });

  it('should log error when handler throws error (err has no status → 500)', (done) => {
    const user = { userId: 2, email: 'error@example.com' };
    const context = createContext(user);

    const handler: CallHandler = {
      handle: () => throwError(() => new Error('Fail')),
    };

    interceptor.intercept(context, handler).subscribe({
      error: (err) => {
        expect(err.message).toBe('Fail');
        expect(logsService.saveLog).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 2,
            userEmail: 'error@example.com',
            status: 500,
          }),
        );
        done();
      },
    });
  });

  it('should log error when handler throws HttpException (err.status exists)', (done) => {
    const user = { userId: 4, email: 'u4@example.com' };
    const fakeHttpError = { message: 'Boom', status: 403 };
    const context = createContext(user);

    const handler: CallHandler = {
      handle: () => throwError(() => fakeHttpError),
    };

    interceptor.intercept(context, handler).subscribe({
      error: () => {
        expect(logsService.saveLog).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 403,
          }),
        );
        done();
      },
    });
  });

  it('should log error when handler throws object with status undefined (status present but undefined)', (done) => {
    const user = { userId: 5, email: 'u5@example.com' };
    const context = createContext(user);

    const fakeHttpError = { message: 'Weird', status: undefined };

    const handler: CallHandler = {
      handle: () => throwError(() => fakeHttpError),
    };

    interceptor.intercept(context, handler).subscribe({
      error: () => {
        expect(logsService.saveLog).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 500,
          }),
        );
        done();
      },
    });
  });

  it('should handle saveLog failure inside tap without throwing', (done) => {
    const user = { userId: 3, email: 'fail@example.com' };
    const context = createContext(user);

    const handler: CallHandler = { handle: () => of('ok') };

    (logsService.saveLog as jest.Mock).mockRejectedValueOnce(
      new Error('DB error'),
    );

    jest.spyOn(console, 'error').mockImplementation(() => {});

    interceptor.intercept(context, handler).subscribe(() => {
      setImmediate(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Error saving log to DB:',
          expect.any(Error),
        );
        done();
      });
    });
  });

  it('should handle saveLog failure inside catchError without throwing', (done) => {
    const user = { userId: 10, email: 'err2@example.com' };
    const context = createContext(user);

    const handler: CallHandler = {
      handle: () => throwError(() => new Error('X')),
    };

    (logsService.saveLog as jest.Mock).mockRejectedValueOnce(
      new Error('DB fail'),
    );

    jest.spyOn(console, 'error').mockImplementation(() => {});

    interceptor.intercept(context, handler).subscribe({
      error: () => {
        setImmediate(() => {
          expect(console.error).toHaveBeenCalledWith(
            'Error saving the error log to the database:',
            expect.any(Error),
          );
          done();
        });
      },
    });
  });
});
