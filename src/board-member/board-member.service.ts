import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardMemberDto } from './dto/create-board-member.dto';
import { Repository } from 'typeorm';
import { BoardMember } from './entities/board-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import { DeleteMemberDto } from './dto/delete-member.dto';

@Injectable()
export class BoardMemberService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async inviteMember(dto: CreateBoardMemberDto): Promise<BoardMember> {
    const board = await this.boardRepository.findOne({
      where: { board_id: dto.board_id },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: dto.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await this.boardMemberRepository.findOne({
      where: { board_id: dto.board_id, user_id: dto.user_id },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this board');
    }

    const boardMember = this.boardMemberRepository.create({
      board_id: dto.board_id,
      user_id: dto.user_id,
    });

    return this.boardMemberRepository.save(boardMember);
  }

  async removeMember(
    dto: DeleteMemberDto,
  ): Promise<{ status: string; message: string }> {
    const boardMember = await this.boardMemberRepository.findOne({
      where: { board_id: dto.board_id, user_id: dto.user_id },
    });
  
    if (!boardMember) {
      throw new NotFoundException('Member not found in this board');
    }
  
    await this.boardMemberRepository.remove(boardMember);
  
    return { status: 'success', message: 'Member removed successfully' };
  }


}
