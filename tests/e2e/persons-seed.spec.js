import { test, expect } from "@playwright/test";
import { seedPersons, clearPersons } from "./helpers/apiHelper";

const SEEDED = [
  { name: "Alice", number: "12-34567890" },
  { name: "Bob", number: "123-4567890" },
];

// Full-stack test: seed backend then verify UI shows seeded data and supports add/delete.
// These tests assume playwright.config's webServer starts both frontend and backend (npm run dev).

test.describe.serial("Persons full-stack flows", () => {
  test.beforeEach(async ({ request }) => {
    // Ensure backend is reachable and start from a clean slate
    await clearPersons(request);
    await seedPersons(request, SEEDED);

    // wait until the API reports the seeded items exist (timeout 15s)
    const base = process.env.PHONEBOOK_API_BASE || "http://localhost:5001";
    const start = Date.now();
    const timeout = 15000;
    while (Date.now() - start < timeout) {
      const res = await request.get(`${base}/api/persons`);
      if (res.ok()) {
        const json = await res.json();
        if (Array.isArray(json) && json.length >= SEEDED.length) {
          break;
        }
      }
      await new Promise((r) => setTimeout(r, 300));
    }
  });

  test("shows seeded persons on the homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // wait for the seeded names to appear in the UI (give the app time to fetch/render)
    for (const p of SEEDED) {
      await expect(page.getByText(p.name)).toBeVisible({ timeout: 15000 });
    }
  });

  test("can add and delete a person via UI (full-stack)", async ({ page, request }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const form = page.locator("form.container");
    await form.getByLabel("Name").fill("Charlie");
    await form.getByLabel("Number").fill("12-78901234");
    await form.getByRole("button", { name: /add/i }).click();

    // table locator reused for precise cell/row lookups (avoid ambiguous getByText matches with alerts)
    const table = page.locator("table");

    // wait for UI to render new person in the table (target the cell explicitly)
    await expect(table.getByRole("cell", { name: "Charlie" })).toBeVisible({ timeout: 10000 });

    // delete Charlie via UI by locating the row that contains Charlie and clicking its delete button
    page.on("dialog", (dialog) => dialog.accept());
    const row = table.getByRole("row").filter({ hasText: "Charlie" }).first();
    await row.getByRole("button", { name: /delete/i }).click();

    await expect(table.getByRole("cell", { name: "Charlie" })).not.toBeVisible({ timeout: 10000 });

    // Check backend no longer returns Charlie
    const base = process.env.PHONEBOOK_API_BASE || "http://localhost:5001";
    const res = await request.get(`${base}/api/persons`);
    const list = await res.json();
    expect(list.find((x) => x.name === "Charlie")).toBeFalsy();
  });
});
