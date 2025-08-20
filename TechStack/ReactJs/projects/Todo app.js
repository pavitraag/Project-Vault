import React, { useState } from "react";

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTask = () => {
    if (task.trim() !== "") {
      setTodos([...todos, { text: task, completed: false }]);
      setTask("");
    }
  };

  const toggleTask = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  const deleteTask = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex gap-2">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          className="border p-2 flex-1 rounded"
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-4 rounded">
          Add
        </button>
      </div>
      <ul className="mt-4">
        {todos.map((t, i) => (
          <li key={i} className="flex justify-between p-2 border-b">
            <span
              onClick={() => toggleTask(i)}
              className={t.completed ? "line-through cursor-pointer" : "cursor-pointer"}
            >
              {t.text}
            </span>
            <button onClick={() => deleteTask(i)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
