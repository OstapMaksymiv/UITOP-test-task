import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryFilter from "./CategoryFilter";
import type { Category } from "@/lib/types";

const categories: Category[] = [
  { id: 1, name: "Work" },
  { id: 2, name: "Home" },
];

describe("CategoryFilter", () => {
  it("shows the current selection", () => {
    render(
      <CategoryFilter categories={categories} value="all" onChange={jest.fn()} />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("All");
  });

  it("calls onChange with a numeric id when a category is picked", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <CategoryFilter categories={categories} value="all" onChange={onChange} />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Home" }));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onChange with "all" when All is picked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <CategoryFilter categories={categories} value={1} onChange={onChange} />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "All" }));

    expect(onChange).toHaveBeenCalledWith("all");
  });
});
