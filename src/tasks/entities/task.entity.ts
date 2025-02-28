// src/tasks/entities/task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { BoardColumn } from 'src/columns/entities/columns.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => BoardColumn, (column) => column.tasks)
  column: BoardColumn;

  @ManyToOne(() => User, (user) => user.tasks)
  assignedUser: User;

  @OneToMany(() => Tag, (tag) => tag.task)
  tags: Tag[];

  @OneToMany(() => Notification, (notification) => notification.task)
  notifications: Notification[];
}
