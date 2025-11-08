import { test, expect } from "@playwright/test";
import { seedPersons, clearPersons } from "./helpers/apiHelper";

const SEEDED = [
  { name: "Alice", number: "12-34567890" },
  { name: "Bob", number: "123-4567890" },
];

// API-level tests: verify seeding and clearing work using Playwright's request fixture.

test.describe("Persons API helpers", () => {
  test("clear and seed then list persons via API", async ({ request }) => {
    await clearPersons(request);
    await seedPersons(request, SEEDED);
    const base = process.env.PHONEBOOK_API_BASE || "http://localhost:5001";
    const res = await request.get(`${base}/api/persons`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    // Names should be present
    const names = json.map((p) => p.name);
    expect(names).toEqual(expect.arrayContaining(["Alice", "Bob"]));
  });

  test("clearing removes persons", async ({ request }) => {
    await seedPersons(request, SEEDED);
    await clearPersons(request);
    const base = process.env.PHONEBOOK_API_BASE || "http://localhost:5001";
    const res = await request.get(`${base}/api/persons`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.length).toBe(0);
  });
});
