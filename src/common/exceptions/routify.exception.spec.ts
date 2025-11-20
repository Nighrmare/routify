import {RoutifyException, TransportNotFoundException, RouteNotFoundException, UserNotFoundException, AccessDeniedException,InvalidCredentialsException,} from './routify.exception';
import { HttpStatus } from '@nestjs/common';

describe('Custom Exceptions', () => {
  it('RoutifyException should return BAD_REQUEST with custom message', () => {
    const exception = new RoutifyException('Something went wrong');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.getResponse()).toEqual({
      error: 'RoutifyError',
      message: 'Something went wrong',
    });
  });

  it('TransportNotFoundException should return NOT_FOUND', () => {
    const exception = new TransportNotFoundException();
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.getResponse()).toEqual({
      error: 'TransportNotFound',
      message: 'Transport method not found',
    });
  });

  it('RouteNotFoundException should return NOT_FOUND', () => {
    const exception = new RouteNotFoundException();
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.getResponse()).toEqual({
      error: 'RouteNotFound',
      message: 'Route not found',
    });
  });

  it('UserNotFoundException should return NOT_FOUND', () => {
    const exception = new UserNotFoundException();
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.getResponse()).toEqual({
      error: 'UserNotFound',
      message: 'User not found',
    });
  });

  it('AccessDeniedException should return FORBIDDEN', () => {
    const exception = new AccessDeniedException();
    expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
    expect(exception.getResponse()).toEqual({
      error: 'AccessDenied',
      message: 'Access denied',
    });
  });

  it('InvalidCredentialsException should return UNAUTHORIZED', () => {
    const exception = new InvalidCredentialsException();
    expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    expect(exception.getResponse()).toEqual({
      error: 'InvalidCredentials',
      message: 'Invalid credentials',
    });
  });
});