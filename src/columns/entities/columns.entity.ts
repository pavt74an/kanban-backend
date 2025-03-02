import { Board } from 'src/boards/entities/board.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';


@Entity()
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  column_id: string;

  @Column({ nullable: false })
  column_name: string;

  @ManyToOne(() => Board, (board) => board.columns)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @Column({ name: 'board_id' })
  board_id: string;

  @OneToMany(() => Task, (task) => task.column, { cascade: true, onDelete: 'CASCADE'})
  tasks: Task[];
}
