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
import { Notification } from 'src/notifications/entities/notification.entity';

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
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
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
      relations: ['assignees', 'column.board.members'], 
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
  
    // เพิ่ม user เข้าไปใน assignees
    task.assignees = [...task.assignees, user];
  
    // บันทึก task ลงฐานข้อมูล
    const savedTask = await this.taskRepository.save(task);
  
    // Log ข้อมูลที่บันทึก
    console.log('Task after assignment:', savedTask);
  
    // ส่ง notification ไปยัง user
    await this.notificationsService.createNotification(
      `You have been assigned to task: ${task.task_name}`,
      userId,
      taskId,
    );
  
    return savedTask;
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


  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
      relations: ['assignees'], // โหลด assignees ด้วย
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
  
  async getAllTasks(columnId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { column: { column_id: columnId } },
      relations: ['assignees'], // โหลด assignees ด้วย
    });
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No tasks found for this column');
    }
    return tasks;
  }

  async deleteTask(
    taskId: string,
  ): Promise<{ status: string; message: string }> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
      relations: ['notifications', 'tags'], 
    });
  
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  
    await this.notificationRepository.remove(task.notifications);
  
    await this.tagRepository.remove(task.tags);
  
    await this.taskRepository.remove(task);
  
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
