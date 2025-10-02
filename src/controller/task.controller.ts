import { Request, Response } from "express";
import {
  getAllTasks,
  getTaskById,
  newTask,
  removeTask,
  updateTaskStatus,
} from "../service/task.service";
import { TaskNotFoundException } from "../exception/task-not-found.exception";
import { InvalidTaskUpdateException } from "../exception/invalid-task-update.exception";
import { CreateTaskDTO } from "../model/dto/create-task.dto";
import { TaskStatusEnum } from "../model/constants/task-status.enum";
import { InvalidTaskCreationException } from "../exception/invalid-task-creation.exception";
import { InvalidTaskRemovalException } from "../exception/invalid-task-removal.exception";

// Helper for error responses
const handleError = (response: Response, error: unknown) => {
  if (error instanceof TaskNotFoundException) {
    response.status(404).json(error.message);
  } else if (
    error instanceof InvalidTaskUpdateException ||
    error instanceof InvalidTaskCreationException ||
    error instanceof InvalidTaskRemovalException
  ) {
    response.status(400).json(error.message);
  } else {
    response.status(500).json("Internal Server Error");
  }
};

/**
 * Handles GET /tasks
 * Returns all tasks.
 */
export const getTasks = (_: Request, response: Response) => {
  const tasks = getAllTasks();
  response.status(200).json(tasks);
};

/** Handles GET /tasks/:id
 * Returns a task by ID.
 */
export const getTask = (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const task = getTaskById(id);
    response.status(200).json(task);
  } catch (error) {
    handleError(response, error);
  }
};

/** Handles POST /tasks
 * Creates a new task.
 */
export const postTask = (
  request: Request<{}, {}, CreateTaskDTO>,
  response: Response
) => {
  try {
    const task = newTask(request.body);
    response.status(201).json(task);
  } catch (error) {
    handleError(response, error);
  }
};

/**
 * Handles PUT /tasks/:id/status
 * Updates the status of a task.
 */
export const putTaskStatus = (
  request: Request<{ id: string }, {}, { newStatus: TaskStatusEnum }>,
  response: Response
) => {
  try {
    const { newStatus } = request.body;
    const { id } = request.params;
    const task = updateTaskStatus(id, newStatus);

    response.status(204).json(task);
  } catch (error) {
    handleError(response, error);
  }
};

/** Handles DELETE /tasks/:id
 * Deletes a task by ID.
 */
export const deleteTask = (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    removeTask(id);
    response.status(204).json("Task deleted successfully");
  } catch (error) {
    handleError(response, error);
  }
};
