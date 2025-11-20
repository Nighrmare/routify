import { HttpException, HttpStatus } from '@nestjs/common';

// Generic Routify error (Bad Request)
export class RoutifyException extends HttpException {
  constructor(message: string) {
    super({ error: 'RoutifyError', message }, HttpStatus.BAD_REQUEST);
  }
}

// Thrown when the transport method does not exist
export class TransportNotFoundException extends HttpException {
  constructor() {
    super(
      { error: 'TransportNotFound', message: 'Transport method not found' },
      HttpStatus.NOT_FOUND,
    );
  }
}

// Thrown when a route cannot be found
export class RouteNotFoundException extends HttpException {
  constructor() {
    super(
      { error: 'RouteNotFound', message: 'Route not found' },
      HttpStatus.NOT_FOUND,
    );
  }
}

// Thrown when the requested user does not exist
export class UserNotFoundException extends HttpException {
  constructor() {
    super(
      { error: 'UserNotFound', message: 'User not found' },
      HttpStatus.NOT_FOUND,
    );
  }
}

// Thrown when a user tries to access a restricted resource
export class AccessDeniedException extends HttpException {
  constructor() {
    super(
      { error: 'AccessDenied', message: 'Access denied' },
      HttpStatus.FORBIDDEN,
    );
  }
}

// Thrown when login credentials are incorrect
export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      { error: 'InvalidCredentials', message: 'Invalid credentials' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
