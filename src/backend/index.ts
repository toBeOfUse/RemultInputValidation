import express from 'express'
import { remultExpress } from 'remult/remult-express'
import { Task } from '../shared/Task'
import { TasksController } from '../shared/TasksController'

export const app = express()

// uses default backend JSON db (notice `db` folder created when adding the first task)
app.use(
  remultExpress({
    entities: [Task],
    controllers: [TasksController]
  })
)
if (!process.env['VITE']) app.listen(3000)
console.log('started')
