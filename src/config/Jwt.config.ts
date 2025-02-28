import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const secret =process.env.APP_JWT_SECRET;
    return {
        secret : secret,
        signOptions:{
            expiresIn: '1d'
        }
    }
  }
}
