import {
  getAllTasks,
  getTaskById,
  newTask,
  removeTask,
  updateTaskStatus,
} from "./task.service";
import { TaskStatusEnum } from "../model/constants/task-status.enum";
import { CreateTaskDTO } from "../model/dto/create-task.dto";
import { describe, expect, beforeEach, test } from "@jest/globals";
import { InvalidTaskCreationException } from "../exception/invalid-task-creation.exception";
import { TaskNotFoundException } from "../exception/task-not-found.exception";
import { InvalidTaskUpdateException } from "../exception/invalid-task-update.exception";

describe("Task Service", () => {
  beforeEach(() => {
    // Remove all tasks before each test
    const tasks = getAllTasks();
    while (tasks.length) {
      removeTask(tasks[0].id);
    }
  });

  test("Create new task", () => {
    const dto: CreateTaskDTO = { title: "Test", description: "description" };
    const task = newTask(dto);
    expect(task.title).toBe("Test");
    expect(task.status).toBe(TaskStatusEnum.PENDING);
    expect(task.description).toBe("description");
    expect(getAllTasks().length).toBe(1);
  });

  test("Create new task with empty title should throw InvalidTaskCreationException", () => {
    const dto: CreateTaskDTO = { title: "", description: "desc" };
    expect(() => newTask(dto)).toThrow(InvalidTaskCreationException);
    expect(getAllTasks().length).toBe(0);
  });

  test("Create new task with missing title should throw InvalidTaskCreationException", () => {
    const dto: CreateTaskDTO = {
      title: undefined as unknown as string,
      description: "desc",
    };
    expect(() => newTask(dto)).toThrow(InvalidTaskCreationException);
    expect(getAllTasks().length).toBe(0);
  });

  test("Create new task with whitespace title should throw InvalidTaskCreationException", () => {
    const dto: CreateTaskDTO = { title: "   ", description: "desc" };
    expect(() => newTask(dto)).toThrow(InvalidTaskCreationException);
    expect(getAllTasks().length).toBe(0);
  });

  test("Create new task with title only", () => {
    const dto: CreateTaskDTO = { title: "Title only" };
    const task = newTask(dto);
    expect(task.title).toBe("Title only");
    expect(task.status).toBe(TaskStatusEnum.PENDING);
    expect(task.description).toBeUndefined();
    expect(getAllTasks().length).toBe(1);
  });

  test("Get all tasks", () => {
    expect(getAllTasks().length).toBe(0);
    newTask({ title: "Task 1" });
    newTask({ title: "Task 2" });
    expect(getAllTasks().length).toBe(2);
  });

  test("Remove task", () => {
    const task1 = newTask({ title: "Task 1" });
    const task2 = newTask({ title: "Task 2" });
    expect(getAllTasks().length).toBe(2);
    removeTask(task1.id);
    expect(getAllTasks().length).toBe(1);
    expect(getAllTasks()[0].id).toBe(task2.id);
  });

  test("Remove non-existing task should return false", () => {
    expect(removeTask("non-existing-id")).toBe(false);
  });

  test("Remove task with invalid ID should throw InvalidTaskUpdateException", () => {
    expect(() => removeTask("")).toThrow(InvalidTaskUpdateException);
  });

  test("Update task status", () => {
    const task = newTask({ title: "Task to update" });
    expect(task.status).toBe(TaskStatusEnum.PENDING);

    const updatedTask = updateTaskStatus(task.id, TaskStatusEnum.IN_PROGRESS);
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.status).toBe(TaskStatusEnum.IN_PROGRESS);
  });

  test("Update task status with invalid ID should throw InvalidTaskUpdateException", () => {
    expect(() => updateTaskStatus("", TaskStatusEnum.IN_PROGRESS)).toThrow(
      InvalidTaskUpdateException
    );
  });

  test("Update task status with invalid status should throw InvalidTaskUpdateException", () => {
    expect(() =>
      updateTaskStatus("some-id", "INVALID_STATUS" as TaskStatusEnum)
    ).toThrow(InvalidTaskUpdateException);
  });

  test("Update non-existing task should throw TaskNotFoundException", () => {
    expect(() =>
      updateTaskStatus("non-existing-id", TaskStatusEnum.COMPLETED)
    ).toThrow(TaskNotFoundException);
  });

  test("Update task status to COMPLETED", () => {
    const task = newTask({ title: "Complete me" });
    const updatedTask = updateTaskStatus(task.id, TaskStatusEnum.COMPLETED);
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.status).toBe(TaskStatusEnum.COMPLETED);
  });

  test("Update task status to PENDING", () => {
    const task = newTask({ title: "Make me pending" });
    updateTaskStatus(task.id, TaskStatusEnum.IN_PROGRESS);
    const updatedTask = updateTaskStatus(task.id, TaskStatusEnum.PENDING);
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.status).toBe(TaskStatusEnum.PENDING);
  });

  test("Update task status to IN_PROGRESS", () => {
    const task = newTask({ title: "Make me in progress" });
    const updatedTask = updateTaskStatus(task.id, TaskStatusEnum.IN_PROGRESS);
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.status).toBe(TaskStatusEnum.IN_PROGRESS);
  });

  test("Update task status to CANCELLED", () => {
    const task = newTask({ title: "Cancel me" });
    const updatedTask = updateTaskStatus(task.id, TaskStatusEnum.CANCELLED);
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.status).toBe(TaskStatusEnum.CANCELLED);
  });

  test("Get all tasks after multiple operations", () => {
    expect(getAllTasks().length).toBe(0);
    const task1 = newTask({ title: "Task 1" });
    const task2 = newTask({ title: "Task 2" });
    expect(getAllTasks().length).toBe(2);
    removeTask(task1.id);
    expect(getAllTasks().length).toBe(1);
    newTask({ title: "Task 3" });
    expect(getAllTasks().length).toBe(2);
    updateTaskStatus(task2.id, TaskStatusEnum.COMPLETED);
    expect(getAllTasks().length).toBe(2);
  });

  test("Get empty task list", () => {
    expect(getAllTasks().length).toBe(0);
  });

  test("Get task by ID", () => {
    const task = newTask({ title: "Task 1" });
    const foundTask = getTaskById(task.id);
    expect(foundTask).toBeDefined();
    expect(foundTask?.id).toBe(task.id);
  });

  test("Get task by non-existing ID should throw TaskNotFoundException", () => {
    expect(() => getTaskById("non-existing-id")).toThrow(TaskNotFoundException);
  });

  test("Try to get non-existing task should throw TaskNotFoundException", () => {
    expect(() => getTaskById("non-existing-id")).toThrow(TaskNotFoundException);
  });
});
