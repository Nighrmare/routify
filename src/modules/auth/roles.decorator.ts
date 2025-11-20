import { SetMetadata } from '@nestjs/common';

// Key used to store roles metadata
export const ROLES_KEY = 'roles';
// Roles decorator to specify required roles for route handlers
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
