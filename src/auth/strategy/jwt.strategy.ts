import { _log } from '@/utils/_log';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static extractJWT(req: Request): null | string {
    if (
      req.cookies &&
      'accessToken' in req.cookies &&
      'refreshToken' in req.cookies
    ) {
      return req.cookies.accessToken;
    } else {
      return null;
    }
  }

  async validate({ sub, username }: { sub: string; username: string }) {
    try {
      const user = await this.authService.validateAccount({ sub, username });

      return user;
    } catch (error) {
      _log(error);
      throw new ForbiddenException(error.message);
    }
  }
}
