import {
    Controller,
    Get,
    Param,
    Patch,
    Delete,
    NotFoundException,
    Body,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { UpdateUserDto } from './dto/update-user.dto';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  

    @Get()
    async findAll() {
      return this.userService.findAll();
    }
  

    @Get(':id')
    async findOne(@Param('id') id: string) {
      try {
        return await this.userService.findOne(id);
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      try {
        return await this.userService.update(id, updateUserDto);
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    }
  

    @Delete(':id')
    async remove(@Param('id') id: string) {
      try {
        return await this.userService.remove(id);
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    }
  }
