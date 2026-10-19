import React, { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskForm from "./TaskForm";
import SearchBar from "./SearchBar";

function App() {
  const { error } = useContext(TaskContext);

  return (
    <div>
      <h1>Task Manager</h1>
      {error && <p role="alert">{error}</p>}
      <TaskForm />
      <SearchBar />
    </div>
  );
}

export default App;
