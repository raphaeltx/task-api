import { Task } from "../model/entity/task.entity";

/** In-memory task storage */
const tasks: Task[] = [];

/**
 * Returns all tasks.
 */
export const findAllTasks = (): Task[] => tasks;

/**
 * Finds a task by its ID.
 */
export const findTaskById = (id: string): Task | undefined =>
  tasks.find((task) => task.id === id);

/**
 * Saves a new task.
 */
export const saveTask = (task: Task): void => {
  tasks.push(task);
};

/**
 * Updates an existing task.
 */
export const updateTask = (updatedTask: Task): Task | undefined => {
  const index = tasks.findIndex((task) => task.id === updatedTask.id);
  if (index === -1) return undefined;
  tasks[index] = updatedTask;
  return updatedTask;
};

/**
 * Deletes a task by its ID.
 */
export const deleteTask = (id: string): boolean => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
};
