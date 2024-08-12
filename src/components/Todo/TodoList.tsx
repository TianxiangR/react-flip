'use client';
import React, { useState } from 'react'
import { Todo } from './types';
import TodoItem from './TodoItem';
import Flipper from '../Flip/Flipper';
import { v4 as uuidv4 } from 'uuid';
import Flipped from '../Flip/Flipped';
import { animate } from '../Flip/flipHelpers';


function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleToggle = (id: string) => {
    setTodos((prev) => prev.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed
        }
      }
      return todo;
    }))
  }

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <div className="flex min-h-screen flex-col items-center  p-24">
      <form onSubmit={(e) => {
        e.preventDefault();
        setTodos((prev) => [...prev, {
          id: uuidv4(),
          title: textInput,
          completed: false,
          createdAt: new Date().toISOString()
        }]);
        setTextInput('');
      }}>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Add a todo"
          className="border border-gray-300 p-2 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Add</button>
      </form>

      <Flipper flipKey={sortedTodos.map((todo) => todo.id).join('')} className="mt-8" element='ul'>
          {sortedTodos.map((todo) => {
            const handleAppear = (el: HTMLElement) => {
              animate(el, [
                { opacity: 0, transform: 'scale(0)' },
                { opacity: 1, transform: 'scale(1)' }
              ], 200);
            };
            const handleExit = async (el: HTMLElement, _index: number, removeElement: () => void) => {
              await animate(el, [
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0)' }
              ], 200);
              removeElement();
            };
              return (<Flipped key={todo.id} flipId={todo.id} onAppear={handleAppear} onExit={handleExit}>
                <li className="flex items-center justify-between w-full p-4 border-b border-gray-300">
                  <TodoItem todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
                </li>
              </Flipped>)
            }
          )}
      </Flipper>
    </div>
  );
}

export default TodoList