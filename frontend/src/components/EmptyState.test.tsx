import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("renders the empty-list message", () => {
    render(<EmptyState />);

    expect(screen.getByText("No tasks yet.")).toBeInTheDocument();
    expect(
      screen.getByText("Add a task above to get started."),
    ).toBeInTheDocument();
  });
});
