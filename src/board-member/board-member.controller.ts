import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { BoardMemberService } from './board-member.service';
import { CreateBoardMemberDto } from './dto/create-board-member.dto';
import { DeleteMemberDto } from './dto/delete-member.dto';

@Controller('board-member/:boardId/members')
export class BoardMemberController {
  constructor(private readonly boardMemberService: BoardMemberService) {}

  @Post()
  async inviteMember(
    @Param('boardId') boardId: string,
    @Body('userId') userId: string,
    @Request() req,
  ) {
    const currentUserId = req.user.id;
    const dto: CreateBoardMemberDto = {
      board_id: boardId,
      user_id: userId,
    };
    return this.boardMemberService.inviteMember(dto);
  }

  @Delete(':userId')
  async removeMember(
    @Param('boardId') boardId: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    const currentUserId = req.user.id; 
    const dto: DeleteMemberDto = {
      board_id: boardId,
      user_id: userId,
    };
    return this.boardMemberService.removeMember(dto);
  }
}
