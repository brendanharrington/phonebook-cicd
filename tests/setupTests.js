import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Global cleanup for DOM between tests
afterEach(() => {
  cleanup();
});

// Global axios mock so components/services that call axios do not perform network requests
// Tests can override per-test with vi.mocked(axios).get.mockResolvedValue(...) or similar.
vi.mock("axios", () => {
  const fn = () => vi.fn();
  return {
    default: {
      get: fn(),
      post: fn(),
      put: fn(),
      delete: fn(),
      // allow creating new axios instances if code does axios.create()
      create: () => ({ get: fn(), post: fn(), put: fn(), delete: fn() }),
    },
  };
});
