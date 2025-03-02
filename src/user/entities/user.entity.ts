import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { Board } from 'src/boards/entities/board.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Task } from 'src/tasks/entities/task.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) 
  email: string;

  @Column()
  fname: string;

  @Column()
  lname: string;

  @Column()
  password: string;

  @OneToMany(() => Board, (board) => board.user, { cascade: true })
  boards: Board[];

  @OneToMany(() => BoardMember, (boardMember) => boardMember.user)
  boardMembers: BoardMember[];

  @ManyToMany(() => Task, (task) => task.assignees)
  tasks: Task[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
