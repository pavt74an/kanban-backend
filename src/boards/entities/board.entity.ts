import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BoardColumn } from 'src/columns/entities/columns.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { Exclude, Transform } from 'class-transformer';

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

  @OneToMany(() => BoardColumn, (column) => column.board, { cascade: true, onDelete: 'CASCADE'})
  columns: BoardColumn[];

  @OneToMany(() => BoardMember, (member) => member.board, { cascade: true, onDelete: 'CASCADE', })
  @Transform(({ value }) => value.map(member => ({ id: member.id, user_id: member.user_id })))
  members: BoardMember[];
}
