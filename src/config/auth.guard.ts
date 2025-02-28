import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    Logger.debug(`request url: ${url}`);
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    // verify token
    const auth = request.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      return false;
    }
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer') {
      return false;
    }
    try {
      const payload = this.jwtService.verify(token);
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    Logger.debug(`request auth: ${auth}`);

    return true;
  }
}
