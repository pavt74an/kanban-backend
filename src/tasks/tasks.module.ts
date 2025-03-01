import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { User } from 'src/user/entities/user.entity';
import { Board } from 'src/boards/entities/board.entity';
import { BoardsModule } from 'src/boards/boards.module';
import { Notification } from 'src/notifications/entities/notification.entity';
import { BoardColumn } from 'src/columns/entities/columns.entity';
import { Task } from './entities/task.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { TagsModule } from 'src/tags/tags.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMember, User, Board,Notification, BoardColumn, Task,Tag]), BoardsModule,TagsModule,NotificationsModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
