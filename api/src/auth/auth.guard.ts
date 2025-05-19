import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const isPublic = this.reflector.get<boolean>(
    //   'isPublic',
    //   context.getHandler(),
    // );
    // if (isPublic) {
    //   return true;
    // }
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    console.log('request.headers', request.headers);
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }
    const jwtString = authHeader.split('Bearer ')[1];
    const payload = this.authService.verify(jwtString);
    request['user'] = payload;

    return true;
  }
}
