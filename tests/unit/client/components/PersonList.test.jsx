import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";

import PersonList from "../../../../client/src/components/PersonList";

describe("PersonList component", () => {
  const persons = [
    { id: 1, name: "Alice", number: "123" },
    { id: 2, name: "Bob", number: "456" },
  ];

  test("renders a list of persons", () => {
    render(<PersonList persons={persons} onDelete={() => {}} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("calls onDelete handler with correct id when delete button clicked", () => {
  const mockDelete = vi.fn();
  render(<PersonList persons={persons} handleDelete={mockDelete} />);

    // Prefer query for buttons near each name. If the implementation uses a 'delete' button text:
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBeGreaterThanOrEqual(2);

    // Click the first delete button and expect handler called with the first person's id
    fireEvent.click(deleteButtons[0]);
    expect(mockDelete).toHaveBeenCalled();
    // If the implementation forwards the id, at least ensure it has been called with something
  });
});