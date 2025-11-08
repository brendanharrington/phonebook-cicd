import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";

import PersonForm from "../../../../client/src/components/PersonForm";

describe("PersonForm component", () => {
  test("renders name and number inputs and calls submit handler", async () => {
    const mockAdd = vi.fn((e) => e.preventDefault && e.preventDefault());
    render(<PersonForm addPerson={mockAdd} />);

    // Try to find inputs by label; fall back to role textbox queries if labels differ
    const nameInput =
      screen.queryByLabelText(/name/i) || screen.getByPlaceholderText(/name/i) || screen.getAllByRole("textbox")[0];
    const numberInput =
      screen.queryByLabelText(/number/i) || screen.getByPlaceholderText(/number/i) || screen.getAllByRole("textbox")[1];

    fireEvent.change(nameInput, { target: { value: "Charlie" } });
    fireEvent.change(numberInput, { target: { value: "789" } });

    const submitButton =
      screen.queryByRole("button", { name: /add/i }) ||
      screen.queryByRole("button", { name: /submit/i }) ||
      screen.getByRole("button", { type: "submit" }) ||
      screen.getAllByRole("button")[0];

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalled();
    });
  });
});