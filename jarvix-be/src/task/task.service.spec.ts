import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  const mockPrismaService = {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService }, 
        { provide: CACHE_MANAGER, useValue: mockCacheManager }, 
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks: Task[] = [
        { id: 1, title: 'Test Task', description: 'Test', comment: 'Test', createdAt: new Date(), updatedAt:new Date() }
      ];

      jest.spyOn(mockPrismaService.task, 'findMany').mockReturnValue(tasks);

      const result = await service.findAll();

      expect(mockPrismaService.task.findMany).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task when found', async () => {
      const task: Task = { id: 1, title: 'Test Task', description: 'Test', comment: 'Test', createdAt: new Date(), updatedAt: new Date() };
      
      jest.spyOn(mockPrismaService.task, 'findUnique').mockReturnValue(task);
      const result = await service.findOne(1);

      expect(result).toEqual(task);
      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when task not found', async () => {
      jest.spyOn(mockPrismaService.task, 'findUnique').mockReturnValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = { title: 'New Task', description: 'Test', comment: 'test' };
      const createdTask: Task = { id: 1, ...createTaskDto ,createdAt:new Date(),updatedAt:new Date() };

      jest.spyOn(mockPrismaService.task, 'create').mockReturnValue(createdTask);
      const result = await service.create(createTaskDto);

      expect(result).toEqual(createdTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({ data: createTaskDto });
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto = { title: 'New Task', description: 'Test', comment: 'test' };
      const updatedTask: Task = { id: 1, ...updateTaskDto ,createdAt:new Date(),updatedAt:new Date() };

      jest.spyOn(mockPrismaService.task, 'update').mockReturnValue(updatedTask);
      const result = await service.update(1,updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateTaskDto });
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const task: Task = { id: 1, title: 'Test Task', description: 'Test', comment: 'Test', createdAt: new Date(), updatedAt: new Date() };
      
      jest.spyOn(mockPrismaService.task, 'delete').mockReturnValue(task);
      const result = await service.remove(1);

      expect(result).toEqual(task);
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when task to remove is not found', async () => {

      jest.spyOn(mockPrismaService.task, 'delete').mockRejectedValue(new NotFoundException(`Task with ID 999 not found`));

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({ where: { id: 999 } });

    });
  });
});