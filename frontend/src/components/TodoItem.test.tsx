import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "./TodoItem";
import type { Todo } from "@/lib/types";

const todo: Todo = {
  id: 1,
  text: "Buy milk",
  completed: false,
  categoryId: 3,
  categoryName: "Shopping",
  createdAt: "2026-06-02T00:00:00.000Z",
};

function renderItem(overrides: Partial<Todo> = {}) {
  const onToggle = jest.fn();
  const onDelete = jest.fn();
  render(
    <ul>
      <TodoItem
        todo={{ ...todo, ...overrides }}
        colorIndex={0}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </ul>,
  );
  return { onToggle, onDelete };
}

describe("TodoItem", () => {
  it("renders the task text and category", () => {
    renderItem();

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Shopping")).toBeInTheDocument();
  });

  it("reflects the completed state in the checkbox", () => {
    renderItem({ completed: true });

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onToggle with the new checked value when toggled", async () => {
    const user = userEvent.setup();
    const { onToggle } = renderItem();

    await user.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
      true,
    );
  });

  it("calls onDelete when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const { onDelete } = renderItem();

    await user.click(screen.getByRole("button", { name: /delete buy milk/i }));

    expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });
});
