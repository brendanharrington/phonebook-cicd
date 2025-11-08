import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import Header from "../../../../client/src/components/Header";

describe("Header component", () => {
  test("renders the default heading text", () => {
    render(<Header />);
    expect(screen.getByText("Phonebook")).toBeInTheDocument();
  });
});