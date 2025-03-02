import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { User } from '../user/entities/user.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { classToPlain } from 'class-transformer';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<{ board: Board; userEmail: string }> {
    Logger.debug(`Creating board for user ID: ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      Logger.error(`User not found with ID: ${userId}`); 
      throw new NotFoundException('User not found');
    }
    Logger.debug(`User found: ${JSON.stringify(user)}`);

    if (!createBoardDto.board_name) {
      throw new BadRequestException('Board name is required');
    }

    const board = this.boardRepository.create({
      board_name: createBoardDto.board_name,
      user: user,
      user_id: userId,
    });

    const savedBoard = await this.boardRepository.save(board);

    // Return  Board with email of User
    return {
      board: savedBoard,
      userEmail: user.email,
    };
  }

  async findAllByUser(
    userId: string,
  ): Promise<{ boards: any; userEmail: string }> {
   
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['email'], 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // get data  Board relate with User
    const boards = await this.boardRepository.find({
      where: { user_id: userId },
      relations: ['columns', 'members'],
    });

    // จัดรูปแบบ response
    return {
      boards: classToPlain(boards), 
      userEmail: user.email,
    };
  }
  async findOne(
    id: string,
    userId: string,
  ): Promise<{ board: any; userEmail: string }> {
    const board = await this.boardRepository.findOne({
      where: { board_id: id, user: { id: userId } },
      relations: ['columns', 'members'],
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['email'], 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      board: classToPlain(board),
      userEmail: user.email,
    };
  }
  async update(
    id: string,
    updateBoardDto: UpdateBoardDto,
    userId: string,
  ): Promise<{ board: Board; userEmail: string }> {

    const board = await this.boardRepository.findOne({
      where: { board_id: id, user: { id: userId } },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // update Board name
    board.board_name = updateBoardDto.board_name;
    const updatedBoard = await this.boardRepository.save(board);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['email'], // ดึงเฉพาะ email
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      board: updatedBoard,
      userEmail: user.email,
    };
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<{ status: string; message: string }> {
 
    const board = await this.boardRepository.findOne({
      where: { board_id: id, user: { id: userId } },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.boardRepository.remove(board);

    return {
      status: 'success',
      message: 'Board deleted successfully',
    };
  }
}
