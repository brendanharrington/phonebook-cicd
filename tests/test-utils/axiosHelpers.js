import axios from "axios";
import { vi } from "vitest";

// Ensure axios is the mocked default from tests/setupTests.js
const mockedAxios = vi.mocked(axios, true);

export function mockAxiosGet(data) {
  mockedAxios.get.mockResolvedValue({ data });
}

export function mockAxiosPost(data) {
  mockedAxios.post.mockResolvedValue({ data });
}

export function mockAxiosPut(data) {
  mockedAxios.put.mockResolvedValue({ data });
}

export function mockAxiosDelete(data) {
  mockedAxios.delete.mockResolvedValue({ data });
}

export function resetAxiosMocks() {
  mockedAxios.get?.mockReset();
  mockedAxios.post?.mockReset();
  mockedAxios.put?.mockReset();
  mockedAxios.delete?.mockReset();
}

export default {
  mockAxiosGet,
  mockAxiosPost,
  mockAxiosPut,
  mockAxiosDelete,
  resetAxiosMocks,
};
