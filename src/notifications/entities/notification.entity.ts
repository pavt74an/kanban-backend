import { User } from 'src/user/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column({ default: false })
  read_status: boolean;

  // Notification belongs to a User
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;


  @ManyToOne(() => Task, (task) => task.notifications)
  @JoinColumn({ name: 'task_id' })
  task: Task; 

  @Column({ name: 'task_id' })
  taskId: string;
}
