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
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';



@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  // สร้าง Board ใหม่
  @Post('add_board')
  async create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    const userId = req.user.id; // รับ ID ของ User จาก JWT token
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
    const userId = req.user.id; // รับ ID ของ User จาก JWT token
    return this.boardsService.findOne(id, userId);
  }

  // อัปเดตชื่อ Board
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Request() req,
  ) {
    const userId = req.user.id; // รับ ID ของ User จาก JWT token
    return this.boardsService.update(id, updateBoardDto, userId);
  }

  // ลบ Board
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.id; // รับ ID ของ User จาก JWT token
    return this.boardsService.delete(id, userId);
  }
}
