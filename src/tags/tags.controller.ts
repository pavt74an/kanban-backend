import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  createTag(
    @Body('name') name: string,
    @Body('taskId') taskId: string,
  ): Promise<Tag> {
    return this.tagsService.createTag(name, taskId);
  }

  @Delete(':id')
  deleteTag(@Param('id') id: string): Promise<void> {
    return this.tagsService.deleteTag(id);
  }

  @Put(':id')
  updateTagName(
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<Tag> {
    return this.tagsService.updateTagName(id, name);
  }

  @Get('task/:taskId')
  getTagsByTask(@Param('taskId') taskId: string): Promise<Tag[]> {
    return this.tagsService.getTagsByTask(taskId);
  }

  @Get()
  getAllTags(): Promise<Tag[]> {
    return this.tagsService.getAllTags();
  }
}
