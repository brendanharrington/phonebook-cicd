import { test, expect } from "@playwright/test";

test.describe("Persons UI smoke tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("renders header and subheadings", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Phonebook/i);
    await expect(page.getByText(/Add a new person/)).toBeVisible();
    await expect(page.getByText(/People/)).toBeVisible();
  });

  test("form fields and add button are present", async ({ page }) => {
    const form = page.locator("form.container");
    await expect(form.getByLabel("Name")).toBeVisible();
    await expect(form.getByLabel("Number")).toBeVisible();
    await expect(form.getByRole("button", { name: /add/i })).toBeVisible();
  });

  test("filter input updates when typing", async ({ page }) => {
    const filter = page.getByLabel("Filter by name");
    await filter.fill("Al");
    await expect(filter).toHaveValue("Al");
  });
});
