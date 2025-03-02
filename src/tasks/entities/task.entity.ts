import { BoardColumn } from 'src/columns/entities/columns.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  task_id: string;

  @Column({ nullable: false })
  task_name: string;

  @ManyToOne(() => BoardColumn, (column) => column.tasks)
  @JoinColumn({ name: 'column_id' })
  column: BoardColumn;

  @Column({ name: 'column_id' })
  column_id: string;

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable({
    name: 'task_assignees',
    joinColumn: { name: 'task_id', referencedColumnName: 'task_id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  assignees: User[];

  @OneToMany(() => Notification, (notification) => notification.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  notifications: Notification[];

  @OneToMany(() => Tag, (tag) => tag.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tags: Tag[];
}
