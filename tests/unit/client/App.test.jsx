import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, test, expect } from "vitest";

import App from "../../../client/src/App";

describe("App component", () => {
  beforeEach(() => {
    // ensure the app's initial data fetch resolves so effects complete during tests
    axios.get.mockResolvedValue({ data: [] });
  });

  test("renders without crashing", async () => {
    render(<App />);
    // wait for the initial data fetch to be called and settled
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  test("renders a heading element", async () => {
    const { container } = render(<App />);
    const heading = container.querySelector("h1, h2, h3, h4, h5, h6");
    // wait for any state updates from effects
    await waitFor(() => expect(heading).toBeInTheDocument());
  });

  test("matches snapshot", async () => {
    const { asFragment } = render(<App />);
    // wait for effects to settle before snapshotting
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(asFragment()).toMatchSnapshot();
  });
});