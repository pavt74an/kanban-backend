// src/board-members/entities/board-member.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class BoardMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Board, (board) => board.members)
  board: Board;

  @ManyToOne(() => User, (user) => user.boardMembers)
  user: User;
}
