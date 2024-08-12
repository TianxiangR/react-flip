import React from 'react'
import { Todo } from './types'

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const { title, completed } = todo;

  return (
    <div className='flex gap-2'>
      <input type="checkbox" checked={completed} onChange={() => onToggle(todo.id)} />
      <span>{title}</span>
      <button className='text-red-500' onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  )
}

export default TodoItem