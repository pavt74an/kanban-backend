import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const db_name = this.configService.get('APP_POSTGRES_DB');
    const db_host = this.configService.get('APP_POSTGRES_HOST');
    const db_port = +this.configService.get('APP_POSTGRES_PORT');
    const db_user = this.configService.get('APP_POSTGRES_USER');
    const db_password = this.configService.get('APP_POSTGRES_PASSWORD');

    return {
      type: 'postgres',
      host: db_host,
      port: db_port,
      username: db_user,
      password: db_password,
      database: db_name,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}
