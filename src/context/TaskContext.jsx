import React, { createContext, useEffect, useState } from "react";

export const TaskContext = createContext(null);
const tasksUrl = import.meta.env.VITE_TASKS_API_URL || "http://localhost:6001/tasks";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        const response = await fetch(tasksUrl);
        if (!response.ok) {
          throw new Error(`Unable to load tasks (${response.status})`);
        }

        const data = await response.json();
        if (isMounted) setTasks(data);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load tasks");
        }
      }
    }

    loadTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  async function addTask(title) {
    try {
      const response = await fetch(tasksUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });
      if (!response.ok) {
        throw new Error(`Unable to add task (${response.status})`);
      }

      const task = await response.json();
      setTasks((currentTasks) => [...currentTasks, task]);
      setError("");
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add task");
      return false;
    }
  }

  async function toggleComplete(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    try {
      const response = await fetch(`${tasksUrl}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!response.ok) {
        throw new Error(`Unable to update task (${response.status})`);
      }

      const updatedTask = await response.json();
      setTasks((currentTasks) =>
        currentTasks.map((item) => (item.id === id ? updatedTask : item)),
      );
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update task");
    }
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleComplete, error }}>
      {children}
    </TaskContext.Provider>
  );
}
