import { BoardMember } from 'src/boards/entities/board-member.entity';
import { Board } from 'src/boards/entities/board.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // เพิ่ม Unique Constraint
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

  @OneToMany(() => Task, (task) => task.assignedUser)
  tasks: Task[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
