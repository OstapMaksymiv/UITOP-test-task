"use client";

import List from "@mui/material/List";
import EmptyState from "./EmptyState";
import TodoItem from "./TodoItem";
import type { Category, Todo } from "@/lib/types";

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  onToggle: (todo: Todo, completed: boolean) => void;
  onDelete: (todo: Todo) => void;
}

export default function TodoList({
  todos,
  categories,
  onToggle,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <List disablePadding>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          colorIndex={categories.findIndex((c) => c.id === todo.categoryId)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
