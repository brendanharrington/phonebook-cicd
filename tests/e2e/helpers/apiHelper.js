// Helpers for Playwright e2e tests to seed/reset backend data using the Playwright request fixture.

/**
 * Seed persons via the API.
 *
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context (test.request or page.request)
 * @param {Array<Object>} persons - array of person objects to create, e.g. [{ name: 'Alice', number: '123' }]
 */
const SERVER_API_BASE = process.env.PHONEBOOK_API_BASE || "http://localhost:5001";

export async function seedPersons(request, persons = []) {
  // wait for server health endpoint before seeding
  const healthUrl = `${SERVER_API_BASE}/health`;
  const start = Date.now();
  const timeout = 20000;
  while (Date.now() - start < timeout) {
    try {
      const h = await request.get(healthUrl);
      if (h.ok()) {
        break;
      }
    } catch {
      // ignore and retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  for (const p of persons) {
    const res = await request.post(`${SERVER_API_BASE}/api/persons`, {
      data: JSON.stringify(p),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok()) {
      const body = await res.text();
      throw new Error(`Seeding failed for ${JSON.stringify(p)}: ${res.status()} ${body}`);
    }
  }
}

/**
 * Delete all persons by fetching list and deleting each. Depends on API providing list and delete endpoints.
 * @param {import('@playwright/test').APIRequestContext} request
 */
export async function clearPersons(request) {
  const res = await request.get(`${SERVER_API_BASE}/api/persons`);
  if (res.ok()) {
    const all = await res.json();
    for (const p of all) {
      await request.delete(`${SERVER_API_BASE}/api/persons/${p.id}`);
    }
  }
}

export default { seedPersons, clearPersons };
