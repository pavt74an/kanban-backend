import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // สร้าง Notification
  @Post()
  async createNotification(
    @Body('message') message: string,
    @Body('userId') userId: string,
    @Body('taskId') taskId: string,
  ): Promise<Notification> {
    return this.notificationsService.createNotification(message, userId, taskId);
  }

  // ทำเครื่องหมายว่า Notification ถูกอ่านแล้ว
  @Put(':id/mark-as-read')
  async markAsRead(@Param('id') id: string): Promise<Notification> {
    const notification = await this.notificationsService.markAsRead(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  // ลบ Notification
  @Delete(':id')
  async deleteNotification(@Param('id') id: string): Promise<void> {
    await this.notificationsService.deleteNotification(id);
  }

  // ดึง Notification ทั้งหมดของ User
  @Get('user/:userId')
  async getNotificationsByUser(
    @Param('userId') userId: string,
  ): Promise<Notification[]> {
    return this.notificationsService.getNotificationsByUser(userId);
  }
}
