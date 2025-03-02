import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { Board } from 'src/boards/entities/board.entity';
import { BoardColumn } from './entities/columns.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { Tag } from 'src/tags/entities/tag.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardColumn, Board,Task,Tag,Notification]),TasksModule
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
