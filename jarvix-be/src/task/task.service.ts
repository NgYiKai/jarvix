import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TaskService {

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }
  
  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data:createTaskDto,
    });

    await this.cacheManager.del('/task');

    return task
  }

  async findAll() {
    let task = await this.prisma.task.findMany();
    
    return task;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });

      await this.cacheManager.del('/task');
      await this.cacheManager.del(`/task/${id}`);

      return task;
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

  }

  async remove(id: number) {
    try {
      const task = await this.prisma.task.delete({
        where: { id },
      });

      await this.cacheManager.del('/task');
      await this.cacheManager.del(`/task/${id}`);

      return task;
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

  }
}
