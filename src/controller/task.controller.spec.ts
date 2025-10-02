import { describe, expect, test } from "@jest/globals";
import {
  deleteTask,
  getTask,
  getTasks,
  postTask,
  putTaskStatus,
} from "./task.controller";
import * as service from "../service/task.service";
import { TaskStatusEnum } from "../model/constants/task-status.enum";
import { TaskNotFoundException } from "../exception/task-not-found.exception";
import { InvalidTaskCreationException } from "../exception/invalid-task-creation.exception";
import { InvalidTaskUpdateException } from "../exception/invalid-task-update.exception";

describe("Task Controller", () => {
  test("Get all tasks", () => {
    const mockTasks = [
      {
        id: "1",
        title: "Test",
        description: "desc",
        status: TaskStatusEnum.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    jest.spyOn(service, "getAllTasks").mockReturnValue(mockTasks);

    const json = jest.fn();
    const status = jest.fn(() => ({ json } as any));
    const response = { status } as any;

    getTasks({} as any, response);
    expect(status).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(mockTasks);
  });

  test("Get all tasks when none exist", () => {
    jest.spyOn(service, "getAllTasks").mockReturnValue([]);

    const json = jest.fn();
    const status = jest.fn(() => ({ json } as any));
    const response = { status } as any;

    getTasks({} as any, response);
    expect(status).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith([]);
  });

  test("Get task by ID", () => {
    const mockTask = {
      id: "1",
      title: "Test",
      description: "desc",
      status: TaskStatusEnum.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(service, "getTaskById").mockReturnValue(mockTask);

    const json = jest.fn();
    const status = jest.fn(() => ({ json } as any));
    const response = { status } as any;
    const request = { params: { id: "1" } } as any;

    getTask(request, response);
    expect(status).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(mockTask);
  });

  test("Get task by non-existing ID should return 404", () => {
    jest.spyOn(service, "getTaskById").mockImplementation(() => {
      throw new TaskNotFoundException("Task not found");
    });

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = { params: { id: "non-existing-id" } } as any;

    getTask(request, response);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith("Task with ID Task not found not found.");
  });

  test("Create new task", () => {
    const mockTask = {
      id: "1",
      title: "Test",
      description: "desc",
      status: TaskStatusEnum.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(service, "newTask").mockReturnValue(mockTask);

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = {
      body: { title: "Test", description: "desc" },
    } as any;

    postTask(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(mockTask);
  });

  test("Create new task with no title should return 400", () => {
    jest.spyOn(service, "newTask").mockImplementation(() => {
      throw new InvalidTaskCreationException("Title is required.");
    });

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = {
      body: { title: "", description: "desc" },
    } as any;

    postTask(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      "Invalid task creation: Title is required."
    );
  });

  test("Put task status", () => {
    const mockTask = {
      id: "1",
      title: "Test",
      description: "desc",
      status: TaskStatusEnum.COMPLETED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(service, "updateTaskStatus").mockReturnValue(mockTask);

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = {
      params: { id: "1" },
      body: { status: TaskStatusEnum.COMPLETED },
    } as any;

    putTaskStatus(request, response);
    expect(response.status).toHaveBeenCalledWith(204);
    expect(json).toHaveBeenCalledWith(mockTask);
  });

  test("Put task status for non-existing ID should return 404", () => {
    jest.spyOn(service, "updateTaskStatus").mockImplementation(() => {
      throw new TaskNotFoundException("Task not found");
    });

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = {
      params: { id: "non-existing-id" },
      body: { newStatus: TaskStatusEnum.COMPLETED },
    } as any;

    putTaskStatus(request, response);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith("Task with ID Task not found not found.");
  });

  test("Put task status with invalid status should return 400", () => {
    jest.spyOn(service, "updateTaskStatus").mockImplementation(() => {
      throw new InvalidTaskUpdateException("Invalid status value.");
    });

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = {
      params: { id: "1" },
      body: { status: "INVALID_STATUS" },
    } as any;

    putTaskStatus(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      "Invalid task. Invalid status value."
    );
  });

  test("Put task status with missing ID should return 400", () => {
    jest.spyOn(service, "updateTaskStatus").mockImplementation(() => {
      throw new InvalidTaskUpdateException("Task ID is required.");
    });

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = {
      params: { id: "" },
      body: { status: TaskStatusEnum.COMPLETED },
    } as any;

    putTaskStatus(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      "Invalid task. Task ID is required."
    );
  });

  test("Put task status with missing status should return 400", () => {
    jest.spyOn(service, "updateTaskStatus").mockImplementation(() => {
      throw new InvalidTaskUpdateException("Invalid or empty status value.");
    });

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = {
      params: { id: "1" },
      body: { status: "" },
    } as any;

    putTaskStatus(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      "Invalid task. Invalid or empty status value."
    );
  });

  test("Delete task", () => {
    jest.spyOn(service, "removeTask").mockReturnValue(true);

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = { params: { id: "1" } } as any;

    deleteTask(request, response);
    expect(response.status).toHaveBeenCalledWith(204);
  });

  test("Delete task with non-existing ID should return 404", () => {
    jest.spyOn(service, "removeTask").mockImplementation(() => {
      throw new TaskNotFoundException("Task not found");
    });

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = { params: { id: "non-existing-id" } } as any;

    deleteTask(request, response);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith("Task with ID Task not found not found.");
  });

  test("Delete task with missing ID should return 400", () => {
    jest.spyOn(service, "removeTask").mockImplementation(() => {
      throw new InvalidTaskUpdateException("Task ID is required.");
    });

    const json = jest.fn();
    const response: any = {
      statusCode: undefined,
      status: jest.fn((code) => {
        response.statusCode = code;
        return response;
      }),
      json,
    };
    const request = { params: { id: "" } } as any;

    deleteTask(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      "Invalid task. Task ID is required."
    );
  });
});
