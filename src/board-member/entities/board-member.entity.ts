
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity()
export class BoardMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Board, (board) => board.members)
  @JoinColumn({ name: 'board_id' })
  @Exclude()
  board: Board;

  @Column({ name: 'board_id' })
  board_id: string;

  @ManyToOne(() => User, (user) => user.boardMembers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  user_id: string;
}
