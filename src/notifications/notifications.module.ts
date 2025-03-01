import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([Notification, Task, User])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService], 
})
export class NotificationsModule {}
