import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodoForm from "./AddTodoForm";
import { createTodo } from "@/lib/api";
import type { Category, Todo } from "@/lib/types";

// Mock the API layer so no real network calls happen.
jest.mock("@/lib/api", () => ({
  createTodo: jest.fn(),
  getApiErrorMessage: (_e: unknown, fallback: string) => fallback,
}));

const mockedCreateTodo = createTodo as jest.MockedFunction<typeof createTodo>;

const categories: Category[] = [
  { id: 1, name: "Work" },
  { id: 2, name: "Home" },
];

beforeEach(() => {
  mockedCreateTodo.mockReset();
});

describe("AddTodoForm", () => {
  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<AddTodoForm categories={categories} onCreated={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Task text is required")).toBeInTheDocument();
    expect(screen.getByText("Category is required")).toBeInTheDocument();
    expect(mockedCreateTodo).not.toHaveBeenCalled();
  });

  it("submits a trimmed payload and notifies the parent on success", async () => {
    const user = userEvent.setup();
    const created: Todo = {
      id: 10,
      text: "Write tests",
      completed: false,
      categoryId: 1,
      categoryName: "Work",
      createdAt: "2026-06-02T00:00:00.000Z",
    };
    mockedCreateTodo.mockResolvedValue(created);
    const onCreated = jest.fn();

    render(<AddTodoForm categories={categories} onCreated={onCreated} />);

    await user.type(screen.getByLabelText("New task"), "  Write tests  ");
    await user.click(screen.getByLabelText("Category"));
    await user.click(screen.getByRole("option", { name: "Work" }));
    await user.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(mockedCreateTodo).toHaveBeenCalledWith({
        text: "Write tests",
        categoryId: 1,
      });
    });
    expect(onCreated).toHaveBeenCalledWith(created);
  });
});
