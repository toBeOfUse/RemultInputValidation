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


import('vite').then(async ({ createServer }) => {
    const viteDevServer = await createServer({
        server: {
            middlewareMode: true
        }
    });
    app.use(viteDevServer.middlewares)
    app.listen(3000, () => console.log("Server started"));
})