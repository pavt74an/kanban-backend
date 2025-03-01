import { Module } from '@nestjs/common';

import { AuthGuard } from './config/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './config/Jwt.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/TypeOrm.config';
import { HealthController } from './health.controller';
import { UserModule } from './user/user.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { TagsModule } from './tags/tags.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { ColumnsModule } from './columns/columns.module';
import { BoardMemberModule } from './board-member/board-member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    JwtModule.registerAsync({
      useClass: JwtConfig,
      global: true,
    }),
    UserModule,
    BoardsModule,
    ColumnsModule,
    TasksModule,
    TagsModule,
    NotificationsModule,
    AuthModule,
    BoardMemberModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
