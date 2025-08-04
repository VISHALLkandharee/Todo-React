import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [todos, setTodo] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState("");
  const [startEditing, setStartEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");

  const addTodos = (e) => {
    e.preventDefault();
    setTodo([...todos, { input, completed: false }]);

    setInput("");
  };


  const startEdit = (idx, currentText) => {
    setEditingId(idx);
    setEditInput(currentText);
    setStartEditing(true);
  };

  const saveEdit = (idx) => {
    if (editInput.trim()) {
      setTodo((prevTodos) => {
        return prevTodos.map((todo, index) => 
          index === idx ? { ...todo, input: editInput } : todo
        );
      });
    }
    setEditingId(null);
    setEditInput("");
    setStartEditing(false);
  }; 


  const removeTodo = (idx) => {
    setTodo((prevTodos) => {
      const updated = prevTodos.filter((_, index) => index !== idx);

      return updated;
    });
  };

  const toggleCompleted = (idx) => {
    setTodo((prevTodos) => {
      return prevTodos.map((todo, index) =>
        index === idx ? { ...todo, completed: !todo.completed } : todo
      );
    });
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <>
      <main>
        <h4>Make Lists to keep updated </h4>
        <div className="container">
          <form className="inputContainer">
            <input
              type="text"
              placeholder="Add Todos...."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="addBtn"
              onClick={(e) => addTodos(e)}
            >
              Add
            </button>
          </form>

          <div className="listContainer">
            {!todos || todos.length <= 0 ? (
              <div className="noTodos">No Todos to Remember!...</div>
            ) : (
              todos.map((todo, idx) => (
                <div
                  className={`list ${todo.completed ? "completed" : ""}`}
                  key={idx}
                  onClick={() => toggleCompleted(idx)}
                >
                  {/*: edit mode*/}
                  {editingId === idx ? (
                    <div className="editMode">
                      <input
                        type="text"
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveEdit(idx);
                        }}
                        autoFocus
                        className="editInput"
                      />
                      <div className="editButtons">
                        <span
                          className="saveIcon"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEdit(idx);
                          }}
                        >
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="todoDesc">{todo.input}</div>
                      <div className="status">{todo.completed ? "Done✓" : ""}</div>
                      <div className="buttons">
                        <span
                          className="editIcon"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(idx, todo.input);
                          }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </span>
                        <span
                          className="delIcon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTodo(idx);
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
