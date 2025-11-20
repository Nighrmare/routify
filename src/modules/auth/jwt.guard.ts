import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard to protect routes using JWT authentication
// Extends Passport's AuthGuard with 'jwt' strategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
