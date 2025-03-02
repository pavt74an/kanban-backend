import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { AuthGuard } from '../config/auth.guard'; 



@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('add_board')
  @UseGuards(AuthGuard)
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @Request() req,
  ): Promise<{ board: Board; userEmail: string }> {
    const userId = req.user.id;
    Logger.debug(`User ID from token: ${userId}`); 
    if (!userId) {
      throw new UnauthorizedException('User ID is missing');
    }
    return this.boardsService.create(createBoardDto, userId);
  }
  // ดึงข้อมูล Board ทั้งหมดของ User
  @Get()
  async findAllByUser(@Request() req) {
    const userId = req.user.id;
    return this.boardsService.findAllByUser(userId);
  }

  // ดึงข้อมูล Board ตาม ID
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;  // รrecieve user id from token
    return this.boardsService.findOne(id, userId);
  }

  // อัปเดตชื่อ Board
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Request() req,
  ) {
    const userId = req.user.id; 
    return this.boardsService.update(id, updateBoardDto, userId);
  }

  // ลบ Board
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.boardsService.delete(id, userId);
  }
}
