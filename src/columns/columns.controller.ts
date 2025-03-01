import { Controller, Post, Body, Delete, Param, Patch, Get } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { UpdateColumnDto } from './dto/update-column.dto';
import { CreateColumnDto } from './dto/create-column.dto';


@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  async createColumn(@Body() dto: CreateColumnDto) {
    return this.columnsService.createColumn(dto);
  }

  @Delete(':id')
  async deleteColumn(@Param('id') columnId: string) {
    return this.columnsService.deleteColumn(columnId);
  }

  @Patch()
  async updateColumnName(@Body() dto: UpdateColumnDto) {
    return this.columnsService.updateColumnName(dto);
  }

  @Get('board/:boardId')
  async getAllColumns(@Param('boardId') boardId: string) {
    return this.columnsService.getAllColumns(boardId);
  }

  @Get(':id')
  async getColumnById(@Param('id') columnId: string) {
    return this.columnsService.getColumnById(columnId);
  }
}
