import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import authConfig from '../config/authConfig';
import { ConfigType } from '@nestjs/config';

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user: User) {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, this.config.jwtSecret, {
      audience: 'aleum',
      issuer: 'aleum',
    });
    return token;
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(
        jwtString,
        this.config.jwtSecret,
      ) as JwtPayload;

      return payload;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
