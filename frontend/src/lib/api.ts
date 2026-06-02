import axios from "axios";
import type { Category, CreateTodoInput, Todo } from "./types";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://task-api.onrender.com",
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
  }
  return fallback;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/categories");
  return data;
}

export async function fetchTodos(categoryId?: number): Promise<Todo[]> {
  const { data } = await apiClient.get<Todo[]>("/todos", {
    params: categoryId ? { category: categoryId } : undefined,
  });
  return data;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const { data } = await apiClient.post<Todo>("/todos", input);
  return data;
}

export async function updateTodoCompleted(
  id: number,
  completed: boolean,
): Promise<Todo> {
  const { data } = await apiClient.patch<Todo>(`/todos/${id}`, { completed });
  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  await apiClient.delete(`/todos/${id}`);
}
