import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardColumn } from './entities/columns.entity';
import { Board } from '../boards/entities/board.entity';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly columnRepository: Repository<BoardColumn>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createColumn(dto: CreateColumnDto): Promise<BoardColumn> {
    const board = await this.boardRepository.findOne({
      where: { board_id: dto.boardId },
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const column = this.columnRepository.create({
      column_name: dto.columnName,
      board,
    });
    return this.columnRepository.save(column);
  }

  async deleteColumn(columnId: string): Promise<{ status: string; message: string }> {
    const column = await this.columnRepository.findOne({
      where: { column_id: columnId },
      relations: ['tasks', 'tasks.notifications', 'tasks.tags'], // โหลด tasks, notifications, และ tags ที่เกี่ยวข้อง
    });
  
    if (!column) {
      throw new NotFoundException('Column not found');
    }
  
    const tasks = column.tasks;
    if (tasks.length > 0) {
      for (const task of tasks) {
        // ลบ notifications ที่เกี่ยวข้องกับ task
        if (task.notifications && task.notifications.length > 0) {
          await this.notificationRepository.remove(task.notifications);
        }
  
        // ลบ tags ที่เกี่ยวข้องกับ task
        if (task.tags && task.tags.length > 0) {
          await this.tagRepository.remove(task.tags);
        }
      }
      // ลบ tasks ที่เกี่ยวข้อง
      await this.taskRepository.remove(tasks);
    }
  
    // ลบ column
    await this.columnRepository.remove(column);
  
    return { status: 'success', message: 'Column deleted successfully' };
  }

  async updateColumnName(dto: UpdateColumnDto): Promise<BoardColumn> {
    const column = await this.columnRepository.findOne({
      where: { column_id: dto.columnId },
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    column.column_name = dto.columnName;
    return this.columnRepository.save(column);
  }

  async getAllColumns(boardId: string): Promise<BoardColumn[]> {
    const columns = await this.columnRepository.find({
      where: { board: { board_id: boardId } },
      relations: ['tasks'],
    });
    if (!columns || columns.length === 0) {
      throw new NotFoundException('No columns found for this board');
    }
    return columns;
  }

  async getColumnById(columnId: string): Promise<BoardColumn> {
    const column = await this.columnRepository.findOne({
      where: { column_id: columnId },
      relations: ['tasks'],
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    return column;
  }
}
