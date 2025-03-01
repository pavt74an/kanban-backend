import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { Tag } from 'src/tags/entities/tag.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // สร้าง Task
  @Post()
  async createTask(
    @Body('taskName') taskName: string,
    @Body('columnId') columnId: string,
  ): Promise<Task> {
    if (!taskName || !columnId) {
      throw new BadRequestException('Task name and column ID are required');
    }
    return this.tasksService.createTask(taskName, columnId);
  }

  // Assign ผู้ใช้ให้กับ Task
  @Patch(':taskId/assign')
  async assignUserToTask(
    @Param('taskId') taskId: string,
    @Body('userId') userId: string,
  ): Promise<Task> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.tasksService.assignUserToTask(taskId, userId);
  }

  // Unassign ผู้ใช้ออกจาก Task
  @Patch(':taskId/unassign')
  async unassignUserFromTask(
    @Param('taskId') taskId: string,
    @Body('userId') userId: string,
  ): Promise<Task> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.tasksService.unassignUserFromTask(taskId, userId);
  }

  // ดึง Task ทั้งหมดใน Column
  @Get('column/:columnId')
  async getAllTasks(@Param('columnId') columnId: string): Promise<Task[]> {
    return this.tasksService.getAllTasks(columnId);
  }

  // ดึง Task โดย ID
  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  // ลบ Task
  @Delete(':taskId')
  async deleteTask(
    @Param('taskId') taskId: string,
  ): Promise<{ status: string; message: string }> {
    return this.tasksService.deleteTask(taskId);
  }

  // ย้าย Task ไปยัง Column อื่น
  @Patch(':taskId/move')
  async moveTaskToColumn(
    @Param('taskId') taskId: string,
    @Body('columnId') columnId: string,
  ): Promise<Task> {
    if (!columnId) {
      throw new BadRequestException('Column ID is required');
    }
    return this.tasksService.moveTaskToColumn(taskId, columnId);
  }

  // อัปเดตชื่อ Task
  @Patch(':taskId/name')
  async updateTaskName(
    @Param('taskId') taskId: string,
    @Body('taskName') taskName: string,
  ): Promise<Task> {
    if (!taskName || typeof taskName !== 'string') {
      throw new BadRequestException('Task name must be a non-empty string');
    }

    const task = await this.tasksService.updateTask(taskId, taskName);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  // เพิ่ม Tag ให้กับ Task
  @Post(':taskId/tags')
  async addTagToTask(
    @Param('taskId') taskId: string,
    @Body('tagName') tagName: string,
  ): Promise<Tag> {
    if (!tagName) {
      throw new BadRequestException('Tag name is required');
    }
    return this.tasksService.addTagToTask(taskId, tagName);
  }

  // ลบ Tag ออกจาก Task
  @Delete(':taskId/tags/:tagId')
  async removeTagFromTask(
    @Param('taskId') taskId: string,
    @Param('tagId') tagId: string,
  ): Promise<void> {
    return this.tasksService.removeTagFromTask(taskId, tagId);
  }

  // ดึง Tag ทั้งหมดของ Task
  @Get(':taskId/tags')
  async getTagsByTask(@Param('taskId') taskId: string): Promise<Tag[]> {
    return this.tasksService.getTagsByTask(taskId);
  }
}
