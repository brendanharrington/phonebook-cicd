import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // Run tests sequentially to avoid database conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: process.env.CI ? "github" : "html",
  
  use: {
    baseURL: process.env.CI ? "http://localhost:5001" : "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // Only run one browser in CI to save time
    ...(!process.env.CI ? [
      {
        name: "firefox",
        use: { ...devices["Desktop Firefox"] },
      },

      {
        name: "webkit",
        use: { ...devices["Desktop Safari"] },
      },

      // Mobile viewports
      {
        name: "Mobile Chrome",
        use: { ...devices["Pixel 5"] },
      },
      {
        name: "Mobile Safari",
        use: { ...devices["iPhone 12"] },
      },
    ] : []),
  ],

  // Run your local dev server before starting the tests (only in local dev)
  // In CI, the workflow starts the server manually
  ...(!process.env.CI && {
    webServer: {
      command: "npm run dev",
      url: "http://localhost:5173", // Vite dev server port
      reuseExistingServer: true,
      timeout: 120 * 1000,
    },
  }),
});