export interface Category {
  id: number;
  name: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
}

export interface CreateTodoInput {
  text: string;
  categoryId: number;
}
