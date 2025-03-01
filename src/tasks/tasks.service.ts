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

  // สร้าง Task
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
      assignees: [], // เริ่มต้นด้วย assignees ว่าง
    });

    return this.taskRepository.save(task);
  }

  async assignUserToTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
      relations: ['assignees', 'column.board.members'], // ดึงข้อมูล assignees และ board ที่ task นั้นอยู่
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

    // ตรวจสอบว่าผู้ใช้เป็นสมาชิกของ board หรือไม่
    const isMember = task.column.board.members.some(
      (member) => member.user_id === userId,
    );
    if (!isMember) {
      throw new ForbiddenException('User is not a member of this board');
    }

    // เพิ่ม user เข้าไปใน assignees
    task.assignees = [...task.assignees, user];
    await this.taskRepository.save(task);

    // ส่ง Notification ไปยังผู้ใช้ที่ถูก assign
    await this.notificationsService.createNotification(
      `You have been assigned to task: ${task.task_name}`,
      userId,
      taskId,
    );

    return task;
  }
  // ลบผู้รับผิดชอบออกจาก Task
  async unassignUserFromTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { task_id: taskId },
      relations: ['assignees'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // ลบ user ออกจาก assignees
    task.assignees = task.assignees.filter((user) => user.id !== userId);
    return this.taskRepository.save(task);
  }

  // ดึง Task ทั้งหมดใน Column
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

  // ดึง Task โดย ID
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

  // delete task
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
      relations: ['column'],  // ตรวจสอบให้แน่ใจว่าเราได้ข้อมูลคอลัมน์
    });
  
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  
    // ดึงข้อมูลคอลัมน์ใหม่ที่สัมพันธ์กับ column_id
    const column = await this.columnRepository.findOne({
      where: { column_id: columnId }
    });
  
    if (!column) {
      throw new NotFoundException('Column not found');
    }
  
    // อัปเดตความสัมพันธ์ของ task กับ column ใหม่
    task.column = column;
  
    // บันทึกการเปลี่ยนแปลง
    await this.taskRepository.save(task);
    
    return task;
  }

// เพิ่ม Tag ให้กับ Task
async addTagToTask(taskId: string, tagName: string): Promise<Tag> {
  const task = await this.taskRepository.findOne({
    where: { task_id: taskId },
  });
  if (!task) {
    throw new NotFoundException('Task not found');
  }

  // สร้าง Tag ใหม่และเชื่อมกับ Task
  return this.tagsService.createTag(tagName, taskId);
}

// ลบ Tag ออกจาก Task
async removeTagFromTask(taskId: string, tagId: string): Promise<void> {
  const task = await this.taskRepository.findOne({
    where: { task_id: taskId },
  });
  if (!task) {
    throw new NotFoundException('Task not found');
  }

  await this.tagsService.deleteTag(tagId);
}

// ดึง Tag ทั้งหมดของ Task
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
