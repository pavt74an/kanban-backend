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
      Logger.error(`User not found with ID: ${userId}`); // เพิ่มบรรทัดนี้
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

    // Return ข้อมูล Board พร้อมกับ email ของ User
    return {
      board: savedBoard,
      userEmail: user.email,
    };
  }

  async findAllByUser(
    userId: string,
  ): Promise<{ boards: any; userEmail: string }> {
    // ดึงข้อมูล email ของ User
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['email'], // ดึงเฉพาะ email
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ดึงข้อมูล Board ที่เกี่ยวข้องกับ User
    const boards = await this.boardRepository.find({
      where: { user_id: userId },
      relations: ['columns', 'members'], // ดึงข้อมูล Columns และ Members พร้อมกัน
    });

    // จัดรูปแบบ response
    return {
      boards: classToPlain(boards), // แปลงข้อมูลก่อนส่งกลับ
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
      select: ['email'], // ดึงเฉพาะ email
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // จัดรูปแบบ response
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
    // ดึงข้อมูล Board ตาม ID และ user_id
    const board = await this.boardRepository.findOne({
      where: { board_id: id, user: { id: userId } },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // อัปเดตชื่อ Board
    board.board_name = updateBoardDto.board_name;
    const updatedBoard = await this.boardRepository.save(board);

    // ดึงข้อมูล email ของ User
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['email'], // ดึงเฉพาะ email
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // จัดรูปแบบ response
    return {
      board: updatedBoard,
      userEmail: user.email,
    };
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<{ status: string; message: string }> {
    // ดึงข้อมูล Board ตาม ID และ user_id
    const board = await this.boardRepository.findOne({
      where: { board_id: id, user: { id: userId } },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // ลบ Board
    await this.boardRepository.remove(board);

    // Return ข้อความเมื่อลบสำเร็จ
    return {
      status: 'success',
      message: 'Board deleted successfully',
    };
  }
}
