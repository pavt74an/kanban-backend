import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { BoardColumn } from 'src/columns/entities/columns.entity';
import { User } from 'src/user/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { TagsService } from 'src/tags/tags.service';
import { Tag } from 'src/tags/entities/tag.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(BoardColumn)
    private readonly columnRepository: Repository<BoardColumn>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService,
    private readonly tagsService: TagsService,
  ) {}

  async createTask(taskName: string, columnId: string): Promise<Task> {
    const column = await this.columnRepository.findOne({
      where: { column_id: columnId },
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }

    const task = this.taskRepository.create({
      task_name: taskName,
      column,
      assignees: [], 
    });

    return this.taskRepository.save(task);
  }

  async assignUserToTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
      relations: ['assignees', 'column.board.members'], // get assignees and  board task existing
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMember = task.column.board.members.some(
      (member) => member.user_id === userId,
    );
    if (!isMember) {
      throw new ForbiddenException('User is not a member of this board');
    }

    task.assignees = [...task.assignees, user];
    await this.taskRepository.save(task);

    await this.notificationsService.createNotification(
      `You have been assigned to task: ${task.task_name}`,
      userId,
      taskId,
    );

    return task;
  }
 
  async unassignUserFromTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
      relations: ['assignees'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.assignees = task.assignees.filter((user) => user.id !== userId);
    return this.taskRepository.save(task);
  }

  async getAllTasks(columnId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { column: { column_id: columnId } },
      relations: ['assignees'],
    });
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No tasks found for this column');
    }
    return tasks;
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
      relations: ['assignees'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async deleteTask(
    taskId: string,
  ): Promise<{ status: string; message: string }> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.taskRepository.delete(taskId);
    return {
      status: 'success',
      message: 'Task deleted successfully',
    };
  }

  async moveTaskToColumn(taskId: string, columnId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
      relations: ['column'], 
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

  
    const column = await this.columnRepository.findOne({
      where: { column_id: columnId },
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    task.column = column;

    await this.taskRepository.save(task);

    return task;
  }

  async addTagToTask(taskId: string, tagName: string): Promise<Tag> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.tagsService.createTag(tagName, taskId);
  }

  async removeTagFromTask(taskId: string, tagId: string): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tagsService.deleteTag(tagId);
  }

  async getTagsByTask(taskId: string): Promise<Tag[]> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.tagsService.getTagsByTask(taskId);
  }
  async updateTask(taskId: string, taskName: string): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.task_name = taskName;
    try {
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException('Error updating task');
    }
  }
}
