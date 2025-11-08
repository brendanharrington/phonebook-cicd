import axios from "axios";

import personService from "../../../../client/src/services/persons";
import { vi, describe, test, expect, afterEach } from "vitest";

// Provide a manual mock for axios so its methods are vi.fn() stubs
vi.mock("axios", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe("personService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("getAll calls axios.get and returns data", async () => {
    const persons = [{ id: 1, name: "Alice" }];
    axios.get.mockResolvedValue({ data: persons });

    const result = await personService.getAll();
    expect(axios.get).toHaveBeenCalled();
    expect(result).toEqual(persons);
  });

  test("create calls axios.post and returns created object", async () => {
    const newPerson = { name: "Bob", number: "456" };
    const created = { id: 2, ...newPerson };
    axios.post.mockResolvedValue({ data: created });

    const result = await personService.create(newPerson);
    expect(axios.post).toHaveBeenCalled();
    expect(result).toEqual(created);
  });

  test("replace calls axios.put and returns updated object", async () => {
    const updated = { id: 1, name: "Alice Updated", number: "999" };
    axios.put.mockResolvedValue({ data: updated });

    const result = await personService.replace(1, updated);
    expect(axios.put).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });

  test("remove calls axios.delete and returns response data (or status)", async () => {
    axios.delete.mockResolvedValue({ data: {} });

    const result = await personService.remove(1);
    expect(axios.delete).toHaveBeenCalled();
    expect(result).toEqual({});
  });
});