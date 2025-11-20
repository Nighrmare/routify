/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      // Extract JWT from the Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Do not ignore token expiration
      ignoreExpiration: false,
      // Use secret key from environment configuration
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  // Validate the JWT payload and return user information
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
