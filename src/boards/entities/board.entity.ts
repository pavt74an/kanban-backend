import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoardMember } from './board-member.entity';
import { BoardColumn } from 'src/columns/entities/columns.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  board_id: string;

  @Column({ nullable: false })
  board_name: string;

  @ManyToOne(() => User, (user) => user.boards) 
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' }) 
  user_id: string;

  @OneToMany(() => BoardColumn, (column) => column.board)
  columns: BoardColumn[];

  @OneToMany(() => BoardMember, (member) => member.board)
  members: BoardMember[];
}
