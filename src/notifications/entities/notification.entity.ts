// src/notifications/entities/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column({ default: false })
  readStatus: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @ManyToOne(() => Task, (task) => task.notifications)
  task: Task;
}
