import express from 'express'
import { remultExpress } from 'remult/remult-express'
// import { MongoClient } from 'mongodb'
// import { MongoDataProvider } from 'remult/remult-mongo'
import { Task } from '../shared/Task'
import { TasksController } from '../shared/TasksController'

export const app = express()

// uses default backend JSON db (notice `db` folder created when adding the first task)
app.use(
  remultExpress({
    entities: [Task],
    controllers: [TasksController]
    // dataProvider: async () => {
    //   const client = new MongoClient('mongodb://127.0.0.1:27017/tasktest')
    //   await client.connect()
    //   return new MongoDataProvider(client.db('tasktest'), client)
    // }
  })
)
if (!process.env['VITE']) app.listen(3000)
console.log('started')
