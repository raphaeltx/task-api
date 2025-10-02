import express from "express";
import taskRouter from "./src/routes/task.routes";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/tasks", taskRouter);

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
