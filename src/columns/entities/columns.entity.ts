
import { Board } from 'src/boards/entities/board.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';


@Entity()
export class BoardColumn {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @ManyToOne(() => Board, (board) => board.columns)
    board: Board;
  
    @OneToMany(() => Task, (task) => task.column)
    tasks: Task[];

}
