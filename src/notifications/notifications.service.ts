import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createNotification(message: string, userId: string, taskId: string): Promise<Notification> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = await this.taskRepository.findOne({ where: { task_id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const notification = this.notificationRepository.create({ message, user, task });
    return this.notificationRepository.save(notification);
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read_status = true;
    return this.notificationRepository.save(notification);
  }

  async deleteNotification(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({ where: { userId } });
  }
}
