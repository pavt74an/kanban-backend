import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { UserModule } from 'src/user/user.module';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { BoardColumn } from 'src/columns/entities/columns.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember,BoardColumn,Notification, Task,Tag]), UserModule],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [TypeOrmModule],
})
export class BoardsModule {}
