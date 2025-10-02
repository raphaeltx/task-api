import { Router } from "express";
import {
  deleteTask,
  getTask,
  getTasks,
  postTask,
  putTaskStatus,
} from "../controller/task.controller";

const taskRouter = Router();

/** Task routes */
taskRouter.get("/", getTasks);
taskRouter.get("/:id", getTask);
taskRouter.post("/", postTask);
taskRouter.put("/:id/status", putTaskStatus);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
