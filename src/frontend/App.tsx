import "todomvc-app-css/index.css";
import "todomvc-common/base.css";
import { useEffect, useState } from "react";
import { Task } from "../shared/Task";
import { ErrorInfo, Remult } from "remult";
import { TasksController } from "../shared/TasksController";

const remult = new Remult();

const taskRepo = remult.repo(Task);

function fetchTasks(filter: string) {
  return taskRepo.find({
    where: filter != "all"
      ? {
        completed: filter == "completed",
      }
      : undefined,
  });
}

function App() {
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<Task>();
  const [itemsLeft, setItemsLeft] = useState(0);

  useEffect(() => {
    fetchTasks(filter).then(setTasks);
  }, [filter]);

  useEffect(() => {
    taskRepo.count({ completed: false }).then(setItemsLeft);
  }, [tasks]);

  const createNewTask = async () => {
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (error: any) {
      alert((error as ErrorInfo)?.message);
    }
  };

  const setAll = async (completed: boolean) => {
    await TasksController.setAll(completed);
    fetchTasks(filter).then(setTasks);
  };

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTaskTitle) createNewTask();
            }}
          />
        </header>

        {tasks.length > 0 && (
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={tasks.length > 0 && tasks[0].completed}
              onChange={(e) => setAll(e.target.checked)}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {tasks.map((task) => {
                if (!editingTask || task.id != editingTask.id) {
                  const setCompleted = async (completed: boolean) => {
                    const updatedTask = await taskRepo.save({
                      ...task,
                      completed,
                    });
                    setTasks(tasks.map((t) => t === task ? updatedTask : t));
                  };

                  const deleteTask = async () => {
                    await taskRepo.delete(task);
                    setTasks(tasks.filter((t) => t !== task));
                  };

                  return (
                    <li
                      key={task.id}
                      className={task.completed ? "completed" : ""}
                    >
                      <div className="view">
                        <input
                          className="toggle"
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => setCompleted(e.target.checked)}
                        />
                        <label onDoubleClick={() => setEditingTask(task)}>
                          {task.title}
                        </label>
                        <button className="destroy" onClick={deleteTask}>
                        </button>
                      </div>
                    </li>
                  );
                } else {
                  const saveTask = async () => {
                    try {
                      const savedTask = await taskRepo.save(editingTask);
                      setTasks(tasks.map((t) => t === task ? savedTask : t));
                      setEditingTask(undefined);
                    } catch (error: any) {
                      alert((error as ErrorInfo)?.message);
                    }
                  };

                  const titleChange = (title: string) => {
                    setEditingTask({ ...editingTask, title });
                  };

                  return (
                    <li key={task.id} className="editing">
                      <input
                        className="edit"
                        value={editingTask.title}
                        onBlur={saveTask}
                        onChange={(e) => titleChange(e.target.value)}
                      />
                    </li>
                  );
                }
              })}
            </ul>
          </section>
        )}

        <footer className="footer">
          <span className="todo-count">
            <strong>
              {itemsLeft}
            </strong>{" "}
            item left
          </span>

          <ul className="filters">
            {["all", "active", "completed"].map((f) => (
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    setFilter(f);
                    e.preventDefault();
                  }}
                  className={filter === f ? "selected" : ""}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </section>

      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created with{" "}
          <a href="https://remult.dev" target="_blank">
            Remult
          </a>
        </p>
        <p>
          Based on <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
}

export default App;