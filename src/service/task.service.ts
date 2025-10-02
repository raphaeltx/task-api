import { randomUUID } from "crypto";
import { TaskNotFoundException } from "../exception/task-not-found.exception";
import { InvalidTaskUpdateException } from "../exception/invalid-task-update.exception";
import { InvalidTaskCreationException } from "../exception/invalid-task-creation.exception";
import { Task } from "../model/entity/task.entity";
import { CreateTaskDTO } from "../model/dto/create-task.dto";
import { TaskStatusEnum } from "../model/constants/task-status.enum";
import {
  deleteTask,
  findAllTasks,
  findTaskById,
  saveTask,
  updateTask,
} from "../repository/task.repository";

/**
 * Retrieves all tasks.
 */
export const getAllTasks = (): Task[] => findAllTasks();

/**
 * Retrieves a task by its ID.
 * @throws TaskNotFoundException if the task does not exist.
 */
export const getTaskById = (id: string): Task => {
  const task = findTaskById(id);
  if (!task) throw new TaskNotFoundException(id);
  return task;
};

/**
 * Creates a new task.
 * @throws InvalidTaskCreationException if the title is missing or empty.
 */
export const newTask = (taskDto: CreateTaskDTO): Task => {
  validateTaskTitle(taskDto.title);

  const task: Task = {
    id: randomUUID(),
    title: taskDto.title,
    description: taskDto.description,
    status: TaskStatusEnum.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  saveTask(task);
  return task;
};

/**
 * Updates the status of a task.
 * @throws InvalidTaskUpdateException if status or ID is invalid.
 * @throws TaskNotFoundException if the task does not exist.
 */
export const updateTaskStatus = (
  id: string,
  newStatus: TaskStatusEnum
): Task | undefined => {
  validateTaskId(id);
  validateTaskStatus(newStatus);

  const task = findTaskById(id);
  if (!task) throw new TaskNotFoundException(id);

  task.status = newStatus;
  task.updatedAt = new Date();

  return updateTask(task);
};

/**
 * Removes a task by its ID.
 * @throws TaskNotFoundException if the task does not exist.
 */
export const removeTask = (id: string): boolean => {
  validateTaskId(id);
  return deleteTask(id);
};

/**
 * Validates the task title.
 * @throws InvalidTaskCreationException if the title is missing or empty.
 */
function validateTaskTitle(title?: string): void {
  if (!title || title.trim() === "") {
    throw new InvalidTaskCreationException("Task title is required.");
  }
}

/**
 * Validates the task status.
 * @throws InvalidTaskUpdateException if the status is invalid.
 */
function validateTaskStatus(status: TaskStatusEnum): void {
  if (!Object.values(TaskStatusEnum).includes(status)) {
    throw new InvalidTaskUpdateException("Invalid or empty status value.");
  }
}

/**
 * Validates the task ID.
 * @throws InvalidTaskUpdateException if the ID is missing or empty.
 */
function validateTaskId(id?: string): void {
  if (!id || id.trim() === "") {
    throw new InvalidTaskUpdateException("Task ID is required.");
  }
}
