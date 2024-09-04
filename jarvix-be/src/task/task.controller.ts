import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {

    let data = await this.taskService.create(createTaskDto);
    let response = {
      msg: 'Sucessfully created task',
      data: data
    }
    return response
  }

  @Get()
  async findAll() {
    let data = await this.taskService.findAll();
    let response = {
      msg: 'Sucessfully found tasks',
      data: data
    }
    return response
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    let data = await this.taskService.findOne(+id);
    let response = {
      msg: 'Sucessfully found task',
      data: data
    }
    return response
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {

    let data = await this.taskService.update(+id, updateTaskDto);
    let response = {
      msg: 'Sucessfully updated task',
      data: data
    }
    return response
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let data = await this.taskService.remove(+id);
    let response = {
      msg: 'Sucessfully deleted task',
      data: data
    }
    return response
  }
}
