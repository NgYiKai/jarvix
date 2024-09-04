import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [{ id: 1, title: 'Test Task', description: 'Test', comment: 'Test', createdAt: new Date(), updatedAt: new Date() }];
      
      mockTaskService.findAll.mockResolvedValue(tasks); 

      const result = await controller.findAll();

      expect(result.data).toEqual(tasks); 
      expect(mockTaskService.findAll).toHaveBeenCalled(); 
    });
  });

  describe('findOne', () => {
    it('should return a task when found', async () => {
      const task = { id: 1, title: 'Test Task', description: 'Test', comment: 'Test', createdAt: new Date(), updatedAt: new Date() };
      mockTaskService.findOne.mockResolvedValue(task);

      const result = await controller.findOne("1")

      expect(result.data).toEqual(task);
      expect(mockTaskService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockTaskService.findOne.mockRejectedValue(new NotFoundException(`Task with ID 999 not found`));

      await expect(controller.findOne("999")).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = { id: 1, title: 'Test Task', description: 'Test', comment: 'Test', createdAt: new Date(), updatedAt: new Date() };
      const createdTask = { id: 1, ...createTaskDto };
      mockTaskService.create.mockResolvedValue(createdTask);

      const result = await controller.create(createTaskDto)

      expect(result.data).toEqual(createdTask);
      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto =  { id: 1, title: 'Test Task', description: 'Test', comment: 'Test', createdAt: new Date(), updatedAt: new Date() };
      const updatedTask = { id: 1, ...updateTaskDto };
      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update("1",updateTaskDto)

      expect(result.data).toEqual(updatedTask);
      expect(mockTaskService.update).toHaveBeenCalledWith(1, updateTaskDto);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const task= { id: 1, title: 'Test Task', description: 'Test', comment: 'Test', createdAt: new Date(), updatedAt: new Date() };
      
      mockTaskService.remove.mockResolvedValue(task);
      const result = await controller.remove("1");

      expect(result.data).toEqual(task);
      expect(mockTaskService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockTaskService.remove.mockRejectedValue(new NotFoundException(`Task with ID 999 not found`));

      await expect(controller.remove("999")).rejects.toThrow(NotFoundException);
      expect(mockTaskService.remove).toHaveBeenCalledWith(999);
    });
  });
});
