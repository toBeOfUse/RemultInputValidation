import express from "express";
import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/Task";
import { TasksController } from "../shared/TasksController";

const app = express();

// uses default backend JSON db (notice `db` folder created when adding the first task)
app.use(remultExpress({
    entities: [Task],
    controllers: [TasksController]
}));

app.listen(process.env["PORT"] || 3002, () => console.log("Server started"));