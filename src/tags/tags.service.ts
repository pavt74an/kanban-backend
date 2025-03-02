import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTag(name: string, taskId: string): Promise<Tag> {
    const task = await this.taskRepository.findOne({ where: { task_id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const tag = this.tagRepository.create({ name, task });
    return this.tagRepository.save(tag);
  }

  async deleteTag(id: string): Promise<void> {
    const tag = await this.tagRepository.findOne({ where: { id } });
  
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
  
    await this.tagRepository.remove(tag);
  }

  async updateTagName(id: string, name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    tag.name = name;
    return this.tagRepository.save(tag);
  }

  async getTagsByTask(taskId: string): Promise<Tag[]> {
    return this.tagRepository.find({ where: { taskId } });
  }

//   get all tags
    async getAllTags(): Promise<Tag[]> {
        return this.tagRepository.find();
    }
}
